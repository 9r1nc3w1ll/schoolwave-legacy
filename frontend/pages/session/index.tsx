import Link from 'next/link';
import { useQuery } from 'react-query';
import { useEffect, useState, Fragment, useCallback, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import DeleteSessions from '@/components/DeleteSessions';
import CreateSessionForm from '@/components/CreateSessionForm';
import EditSessionForm from '@/components/EditSessionForm';
import { getSession } from '@/apicalls/session';
import { dateInPast } from '@/utility_methods/datey';




const Export =  (props:any) => {
 
  const [search, setSearch] = useState<string>('');
  const [activeToolTip, setActiveToolTip] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [sessions, setSessions] = useState<[]>([])
  const [filteredsessions, setFilteredsessions] = useState<any>(sessions);
  const [modal, setmodal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>();
  


  useEffect(()=>{
    if(activeToolTip != ''){

      const x = sessions.find((t:any)=>{
        return t.id == activeToolTip
      })
  
      if(x){

        setSelectedSession(x)
      }
    }
    
  }, [activeToolTip])


  
  const {data:h, isSuccess, status, isLoading} = useQuery('session', ()=>{
  
    return getSession(props.user_session.access_token)
  })

  useEffect(() => {
    setFilteredsessions(() => {
      return sessions?.filter((item:any) => {
        return item.name.toLowerCase().includes(search.toLowerCase()) || item.start_date.toLowerCase().includes(search.toLowerCase());
      });
    });
  }, [search, sessions, status]);
  useEffect(()=>{

    if (isSuccess ){
      setSessions(h.data)
    }

  }, [h, isSuccess, status])
  const displaySession: () => any=()=>{
    if(sessions?.length > 0){
      return filteredsessions.map((data:any) => {
        return (
          <tr className={`${data.active? `bg-primary-light`: ''} !important`} key={data.id}>
            <td>
              <div className="whitespace-nowrap"><Link href={`/session/${data.name}`}>{data.name} </Link></div>
            </td>
            <td>{data.start_date}</td>
            <td>{data.end_date}</td>
            <td><input type='checkBox' checked={data.active} readOnly /></td>
            <td className="text-center ">
             
              <button type="button" className='relative' onClick={()=>{
                setActiveToolTip(data.id)
                
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                {      activeToolTip == data.id && selectedSession ? 
                  (    
                    <div className='bg-[#f7f7f5] absolute bottom-0 left-0 text-left shadow-md mt-8 translate-x-[-105%] translate-y-[70%] w-[110px] z-10'>
                      {!dateInPast (new Date(data.end_date), new Date)  && !data.active ?  
                        <>
                          <p className='mb-2 px-3 pt-2 hover:bg-white' onClick={() => {
                            setmodal(true)} 
                        
                          }>Edit</p> 
                          <p className='mb-2 px-2  hover:bg-white'>Set as Current</p>
                          <DeleteSessions sessionID = {selectedSession.id} user_session={props.user_session}/>
                        </>
                        : data.active ?
                      
                          <>
                            <p className='mb-2 px-3 pt-2 hover:bg-white' onClick={() => {
                              setmodal(true)} 
                        
                            }>Edit</p> 
                           
                          </>
                          : <>
                            <p className='mb-2 px-2  hover:bg-white'>View Data</p>
                          </>}

                     
                      

                    </div>) : <></>}
              </button>
           
         
            </td>
          </tr>
        );
      })
    }else if(isLoading){
      return<tr><td> Loading Data...</td></tr>
    }else    {
      return<tr><td> No Sessions data to display</td></tr>
    }
  }
  return (
    <div className='lg:grid grid-cols-6 gap-6'>
      <div className='panel col-span-2'>
        <div className='panel bg-[#f5f6f7]'>
          <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Create New Session</h5>
          <CreateSessionForm   user_session={props.user_session}  exit={setmodal}  />
        </div>
      </div>
      <div className='panel col-span-4 ' >
        <div className=' md:flex justify-between '>
          <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Session List</h5>
      
          <form className=" w-full sm:w-1/2 mb-5">
            <div className="relative">
              <input
                type="text"
                value={search}
                placeholder="Search Sessions..."
                className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="button" className="btn btn-primary absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex sessions-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>

              </button>
            </div>
          </form>
       
        </div>
        <div className="table-responsive mb-5  pb-[100px] " onClick={(e:any)=>{
      
          if(e.target.localName != 'svg' && e.target.localName != 'path'){
            setActiveToolTip('')
          }
        }}>
          <table className="table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Current Session?</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {displaySession()}
            </tbody>
          </table>
        </div>


        <div>
     
          <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" open={modal} onClose={() => setmodal(false)}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0" />
              </Transition.Child>
              <div id="fadein_left_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                <div className="flex items-start justify-center min-h-screen px-4">
                  <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__fadeInUp">
                    <div className="w-4/5 mx-auto py-5">
                      <h5 className=" text-lg font-semibold dark:text-white-light">Edit Session</h5>
                      <p className='text-primary mb-5 text-sm'>{selectedSession?selectedSession.name: ''}</p>
                  
                      <EditSessionForm create={false} user_session={props.user_session} sessionData={selectedSession} exit={setmodal}  />
                    </div>
                  </Dialog.Panel>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default Export;