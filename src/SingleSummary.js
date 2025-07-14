import { useState, useEffect } from "react"
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

export default function SingleSummary(props){

    const [summary, setSummary] = useState() 

    useEffect(()=>{
        setSummary(props.singleSummary)
    })

    return(
        <>
            {summary?
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Report Summary</Accordion.Header>
                        <Accordion.Body>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <td><strong>Category</strong></td>
                                        <td><strong>Amount ($)</strong></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* We cannot use .map because this isnt an array but rather an object so we use Object.entries(summary).map() this way we could get the key/values*/}
                                    {Object.entries(summary).map(([category, amount], index)=>(
                                        <tr>
                                            <td>{category.slice(0,1).toUpperCase() + category.slice(1)}</td>
                                            <td>{amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            :<></>}
        </>
    )
}