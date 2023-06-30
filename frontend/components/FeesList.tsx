

const FeesList = () => {

    const tableData = [
       
        {
            id: 4,
            invoice_no: "12201",
            term: "2022-2023",
            name: 'Godi Ebenizer',
            status: 'Paid',
            
        },
        {
            id: 4,
            invoice_no: "102201",
            term: "2022-2023",
            name: 'Solanke Rose',
            status: 'Partial Payment',
            
        },
        {
            id: 4,
            invoice_no: "52201",
            term: "2022-2023",
            name: 'Vincent Carpenter',
            status: 'Failed',
            
        },
    ];

    return(
        <div className="panel">
                    <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Fees Details</h5>
        <div className="table-responsive mb-5">
    <table>
        <thead>
            <tr>
                <th>Invoice No</th>
                <th>Term</th>
                <th>Student</th>
                <th>Status</th>
                
            </tr>
        </thead>
        <tbody>
            {tableData.map((data) => {
                return (
                    
                    <tr key={data.id}>
                        <td>{data.invoice_no}</td>
                        <td>{data.term}</td>
                        <td>
                            <div className="whitespace-nowrap">{data.name}</div>
                        </td>
                        <td>
                            <span
                                className={`badge whitespace-nowrap ${
                                    data.status === 'Paid'
                                        ? 'badge-outline-primary'
                                        : data.status === 'Partial Payment'
                                        ? 'badge-outline-secondary'
                                        : data.status === 'Failed'
                                        ? 'badge-outline-danger'
                                        : 'badge-outline-primary'
                                }`}
                            >
                                {data.status}
                            </span>
                        </td>
                        
                    </tr>
                );
            })}
        </tbody>
    </table>
</div>
</div>
);
};
export default FeesList

