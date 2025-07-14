import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { useState } from 'react';

export default function Home(){
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const changeFile = (e)=>{
        // We could grab the file from target 
        setFile(e.target.files[0])
    }

    const uploadFile = (e)=>{
        setLoading(true)
        e.preventDefault()
        // Run your axios call here
        const fd = new FormData()
        fd.append('file',file)

        console.log(fd)
        setLoading(false)
    }

    return (
        <>
            <Container>
                <Row className='justify-content-md-center'>
                    <Col md='10'>
                        <Container>
                            <Row className='mb-4'>
                                <h2 className='text-center fw-semibold fs-2'>Spending Analysis</h2>
                            </Row>
                            <Row>
                                <Col>
                                    <Container 
                                        style={{'background-color': '#565f6e', 'padding': '40px', 'border-radius': '20px 10px 20px 10px', 'color':'#f8f9fb'}}>
                                            <p className='fs-4'>
                                                <b>We</b> help you track and understand your financial habits by breaking down your expenses into clear, visual insights.
                                            </p>
                                            <hr></hr>
                                            <Card>
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
                                    </Container>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}