import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import SingleSummary from './SingleSummary';
import { useState } from 'react';
import axios from 'axios'

export default function Home(){
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [baseURL, setBaseURL] = useState('http://localhost:8000')
    const [msg, setMsg] = useState('') 
    const [showMsg, setShowMsg] = useState(false)
    const [singleSummary, setSingleSummary] = useState(null)

    const closeShowMsg = ()=>{
        setShowMsg(false)
    }
    
    const changeFile = (e)=>{
        // We could grab the file from target 
        setFile(e.target.files[0])
    }

    const uploadFile = (e)=>{
        e.preventDefault()
        // Run your axios call here
        const fd = new FormData()
        fd.append('file',file)
        setLoading(true)
        axios.post(`${baseURL}/uploads/`, fd,{'content-type': 'multipart/form-data'}).then((r)=>{
            console.log(r)
            if(r.data.message){
                // File was submitted successfully
                setMsg(r.data.message)
                setSingleSummary(r.data.spending_summary)
                setShowMsg(true)
                setLoading(false)
            }
        })
    }

    return (
        <>
            <Container>
                <Row className='justify-content-md-center'>
                    <Col md='10'>
                        <Container>
                            <Row>
                                <Col>
                                    <Container 
                                        style={{'background-color': '#565f6e', 'padding': '40px', 'border-radius': '10px 25px 10px 25px', 'color':'#f8f9fb'}}>
                                            <h2 className='text-center fw-semibold fs-2 mb-5'>Spending Analysis</h2>
                                            <p className='fs-4'>
                                                We help you track and understand your financial habits by breaking down your expenses into clear, visual insights.
                                            </p>
                                            <hr></hr>
                                            <Card className='mb-5'>
                                                <Card.Header as="h4">Report Submission</Card.Header>
                                                <Card.Body>
                                                    <Form.Group controlId="formFile" className="mb-3">
                                                        <Form.Label>Upload CSV Report</Form.Label>
                                                        <Form.Control type="file" onChange={changeFile} accept=".csv"/>
                                                    </Form.Group>
                                                    <div className='d-grid'>
                                                        {loading?
                                                            <>
                                                                <Button variant="primary" disabled>
                                                                    <Spinner
                                                                    as="span"
                                                                    animation="grow"
                                                                    size="sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                    />
                                                                    Uploading CSV...
                                                                </Button>
                                                            </>
                                                        :
                                                            <>
                                                                <Button variant="success" type='submit' onClick={uploadFile}>Submit</Button>   
                                                            </>
                                                        }
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                            <SingleSummary singleSummary={singleSummary}></SingleSummary>
                                    </Container>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
            <ToastContainer
                className="p-3"
                position="bottom-end"
                style={{ zIndex: 1 }}
            >
                <Toast show={showMsg} onClose={closeShowMsg} delay={5000} autohide bg='success'>
                    <Toast.Header>
                        <img
                        src="sa_logo.png"
                        width="35"
                        height="35"
                        className="rounded me-2"
                        alt="Spending Analysis"
                        />
                        <strong className="me-auto">Message</strong>
                        
                    </Toast.Header>
                    <Toast.Body>{msg}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    )
}