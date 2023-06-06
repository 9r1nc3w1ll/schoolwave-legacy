
import { useRouter } from "next/router";
import Link from "next/link";

export default function Basic ( ) {


  const tableData =[
    {
      id: 1,
      name: 'First Term',
      email: 'johndoe@yahoo.com',
      start_date: '10/08/2020',
      end_date: '13/08/2020',
      sale: 120,
      status: 'Complete',
      register: '5 min ago',
      progress: '40%',
      position: 'Developer',
      office: 'London',
      active: true
    },
    {
      id: 2,
      name: 'Second Term',
      email: 'shaunpark@gmail.com',
      start_date: '11/08/2020',
      end_date: '13/08/2020',
      sale: 400,
      status: 'Pending',
      register: '11 min ago',
      progress: '23%',
      position: 'Designer',
      office: 'New York',
      active: false
    },
    {
      id: 3,
      name: 'Third Term',
      email: 'alma@gmail.com',
      start_date: '12/02/2020',
      end_date: '13/08/2020',
      sale: 310,
      status: 'In Progress',
      register: '1 hour ago',
      progress: '80%',
      position: 'Accountant',
      office: 'Amazon',
      active: false
    },
        
  ];
 
  const router = useRouter()
  return (
    <div className="panel">
      <h5 className="mb-5 text-lg font-semibold dark:text-white-light">{router.query.id}</h5>
      <div className="table-responsive mb-5 ">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data) => {
              return (
                <tr className={`${data.active? `bg-primary-light`: ''} !important`} key={data.id}>
                  <td>
                    <div className="whitespace-nowrap"><Link href={`#`}>{data.name} </Link></div>
                  </td>
                  <td>{data.start_date}</td>
                  <td>{data.end_date}</td>
                  <td className="text-center">
                   
                    <button type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                      </svg>

                    </button>
               
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
