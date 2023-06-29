

const FeesList = () => {

    const tableData = [
        {
            id: 1,
            name: 'John Doe',
            email: 'johndoe@yahoo.com',
            date: '10/08/2020',
            sale: 120,
            status: 'Complete',
            register: '5 min ago',
            progress: '40%',
            position: 'Developer',
            office: 'London',
        },
        {
            id: 2,
            name: 'Shaun Park',
            email: 'shaunpark@gmail.com',
            date: '11/08/2020',
            sale: 400,
            status: 'Pending',
            register: '11 min ago',
            progress: '23%',
            position: 'Designer',
            office: 'New York',
        },
        {
            id: 3,
            name: 'Alma Clarke',
            email: 'alma@gmail.com',
            date: '12/02/2020',
            sale: 310,
            status: 'In Progress',
            register: '1 hour ago',
            progress: '80%',
            position: 'Accountant',
            office: 'Amazon',
        },
        {
            id: 4,
            
            name: 'Vincent Carpenter',
            email: 'vincent@gmail.com',
            date: '13/08/2020',
            sale: 100,
            status: 'Canceled',
            register: '1 day ago',
            progress: '60%',
            position: 'Data Scientist',
            office: 'Canada',
        },
    ];

    return(
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
                        <td>{data.id}</td>
                        <td>
                            <div className="whitespace-nowrap">{data.name}</div>
                        </td>
                        <td>{data.email}</td>
                        <td>
                            <span
                                className={`badge whitespace-nowrap ${
                                    data.status === 'Paid'
                                        ? 'badge-outline-primary'
                                        : data.status === 'Partial Payment'
                                        ? 'badge-outline-secondary'
                                        : data.status === 'Canceled'
                                        ? 'badge-outline-danger'
                                        : 'badge-outline-primary'
                                }`}
                            >
                                {data.status}
                            </span>
                        </td>
                        <td className="text-center">{data.register}</td>
                    </tr>
                );
            })}
        </tbody>
    </table>
</div>
);
};
export default FeesList

