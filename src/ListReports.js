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

export default function ListReports(){

    const [uploadedFiles, setUploadedFiles] = useState()
    const [baseURL, setBaseURL] = useState('http://localhost:8000')
    const [showSummary, setShowSummary] = useState(false)
    const [fileName, setFileName] = useState(null)
    const [fileSummary, setFileSummary] = useState(null)
    const [fileTransactions, setFileTransactions] = useState(null)

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
            axios.get(r.data.summary_url).then(r=>{
                setFileSummary(r.data)
            })
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
                                    <div className='mt-5' style={{'textAlign':'end'}}>
                                        <Button>
                                            Save as PDF
                                        </Button>
                                    </div>
                                </Container>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}