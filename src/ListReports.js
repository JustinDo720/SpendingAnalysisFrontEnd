import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

export default function ListReports(){

    const [uploadedFiles, setUploadedFiles] = useState()
    const [baseURL, setBaseURL] = useState('http://localhost:8000')
    const [showSummary, setShowSummary] = useState(false)
    const [fileName, setFileName] = useState(null)
    const [fileSummary, setFileSummary] = useState(null)
    const [fileTransactions, setFileTransactions] = useState(null)
    const [fileDownload, setFileDownload] = useState(null)
    const [uploadLoading, setUploadLoading] = useState(false)

    useEffect(()=>{
        axios.get(`${baseURL}/uploads/`).then(r=>{
            setUploadedFiles(r.data.uploaded_files)
        })
    }, [])

    const formatDate = (dateStr)=>{
        const options = {year: 'numeric', month: 'long', day: 'numeric'}
        const formated_date = new Date(dateStr)
        return formated_date.toLocaleDateString(options)
    }

    const displaySummaryModal = (file_name, file_url)=>{
        setShowSummary(true)
        setFileName(file_name)
        axios.get(file_url).then(r=>{

            setFileTransactions(r.data.transactions)
            setFileDownload(`${r.data.summary_url}download/`)
            axios.get(r.data.summary_url).then(r=>{
                setFileSummary(r.data)

            })
        })
    }

    const savePDF = (e)=>{
        e.preventDefault()
        setUploadLoading(true)
        axios.get(fileDownload,{responseType: 'blob'}).then(r=>{
            // Build a link to automatically click 
            const blob = new Blob([r.data])
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url 

            // Extracting filename 
            // Make sure in Django we have: response['Access-Control-Expose-Headers'] = 'Content-Disposition' because of axios
            const cD = r.headers['content-disposition']     // remember we set filename=''
            let baseFileName = 'summary_report.pdf'
            if(cD){
                // regex to find specifically our filename=
                const match = cD.match(/filename="(.+)"/);
                if(match.length > 1){
                    baseFileName = match[1]
                }
            }
            link.setAttribute('download', baseFileName)
            
            // Appending our link then clicking 
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setUploadLoading(false)

        })
    }

    return (
        <>
            <Row className='justify-content-center mt-5'>
                <Col md={10}>
                    <Container style={{'background-color': '#a2acbd', 'padding': '35px', 'border-radius': '10px'}}>
                        <h2 className='text-center fw-semibold fs-2 mb-5' style={{'color': '#565f6e'}}>CSV Reports</h2>
                        <Table striped size="sm">
                            <thead>
                                <tr>
                                <th>#</th>
                                <th >Name</th>
                                <th>Uploaded Date</th>
                                <th style={{'textAlign': 'center'}}>Summary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {uploadedFiles?uploadedFiles.map((file, index)=>(
                                    <tr key={index}>
                                        <td>
                                            {file.id}
                                        </td>
                                        <td>
                                            <a href={file.file} target='_blank'>{file.file_name}</a>
                                        </td>
                                        <td>
                                            {formatDate(file.uploaded_at)}
                                        </td>
                                        <td>
                                            <div className='d-grid gap-2'>
                                                <Button variant="info" size="sm" onClick={()=>displaySummaryModal(file.file_name, file.url)}>View</Button>
                                            </div>
                                        </td>
                                    </tr>
                                )): <></>}
                                <tr>
                                </tr>
                            </tbody>
                        </Table>
                    </Container>
                </Col>
            </Row>
            <Modal
                show={showSummary}
                onHide={() => setShowSummary(false)}
                dialogClassName="modal-90w"
                aria-labelledby="csv-summary-modal"
                fullscreen={true}
            >
                <Modal.Header closeButton>
                <Modal.Title id="csv-summary-modal">
                    {fileName}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className='justify-content-center'>
                        <Col md={10}>
                                <Container style={{'background-color': '#a2acbd', 'padding': '35px', 'border-radius': '10px'}}>
                                    <Tabs
                                    defaultActiveKey="quick-details"
                                    id="summary-tabs"
                                    className="mb-3"
                                    >   
                                        <Tab eventKey="quick-details" title="Details">
                                            <Row>
                                                <Col md={4}>
                                                    <ListGroup>
                                                        <ListGroup.Item variant="dark">
                                                            <b>Total Spent:</b> ${fileSummary?<>{fileSummary.total_spent.toFixed(2)}</>:<>N/A</>} 
                                                        </ListGroup.Item>
                                                        <ListGroup.Item variant="dark">
                                                            <b>Number of Transactions:</b> {fileSummary?<>{fileSummary.total_transactions}</>:<>N/A</>} 
                                                        </ListGroup.Item>
                                                        <ListGroup.Item variant="dark">
                                                            <b>Number of Categories:</b> {fileSummary?<>{fileSummary.unique_categories}</>:<>N/A</>} 
                                                        </ListGroup.Item>
                                                            <ListGroup.Item variant="dark">
                                                            <b>Number of Vendors:</b> {fileSummary?<>{fileSummary.unique_vendors}</>:<>N/A</>} 
                                                        </ListGroup.Item>
                                                        <ListGroup.Item variant="dark">
                                                            <b>Date Range:</b> {fileSummary?<>{formatDate(fileSummary.begin_date)} - {formatDate(fileSummary.end_date)}</>:<>N/A</>} 
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                </Col>
                                                <Col md={8}>
                                                    <Table striped bordered size="sm">
                                                        <thead>
                                                            <tr>
                                                                <th>Top 5 Vendors</th>
                                                                <th>Amount <b>($)</b></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {fileSummary?
                                                                <>
                                                                    {Object.entries(fileSummary.top_vendors).map(([vendor, amount],index)=>(
                                                                        <tr key={index}>
                                                                            <td>{vendor}</td>
                                                                            <td>{amount.toFixed(2)}</td>
                                                                        </tr>
                                                                    ))}
                                                                </>
                                                            :<></>}
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                        </Tab>
                                        <Tab eventKey="spending-per-vendors" title="Spending Per Vendor">
                                                <Table striped bordered size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Vendor</th>
                                                            <th>Amount <b>($)</b></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {fileSummary?
                                                            <>
                                                                {Object.entries(fileSummary.spending_per_vendor).map(([vendor, amount],index)=>(
                                                                    <tr key={index}>
                                                                        <td>{vendor}</td>
                                                                        <td>{amount.toFixed(2)}</td>
                                                                    </tr>
                                                                ))}
                                                            </>
                                                        :<></>}
                                                    </tbody>
                                                </Table>
                                        </Tab>
                                        <Tab eventKey="spending-per-category" title="Spending Per Category">
                                                <Table striped bordered hover size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Category</th>
                                                            <th>Amount <b>($)</b></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {fileSummary?
                                                            <>
                                                                {Object.entries(fileSummary.spending_per_category).map(([category, amount],index)=>(
                                                                    <tr key={index}>
                                                                        <td>{category}</td>
                                                                        <td>{amount.toFixed(2)}</td>
                                                                    </tr>
                                                                ))}
                                                            </>
                                                        :<></>}
                                                    </tbody>
                                                </Table>
                                        </Tab>
                                    </Tabs>
                                    {uploadLoading?
                                        <div className='mt-5' style={{'textAlign':'end'}}>
                                            <Button variant="primary" disabled>
                                                <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                />
                                                    Downloading Report File...
                                            </Button>
                                        </div>
                                    :
                                        <div className='mt-5' style={{'textAlign':'end'}}>
                                            <Button onClick={savePDF}>
                                                Save as PDF
                                            </Button>
                                        </div>
                                    }
                                </Container>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}