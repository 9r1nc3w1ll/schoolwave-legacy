import { AssignUserToClass } from '@/apicalls/clas';
import { getStaffs } from '@/apicalls/users';
import { showAlert } from '@/utility_methods/alert';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Select from 'react-select';

const ClassUserAssignment =(props: any)=>{
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState([]);
  const {data, isSuccess, status, isLoading} = useQuery('getStaffs', async ()=> {
    
    return getStaffs(props.user_session?.access_token)
  })

  const queryClient = useQueryClient();
  const { mutate, error } = useMutation(
    (data: any) =>
      AssignUserToClass(data, props.user_session.access_token),
    {
      onSuccess: async (data) => {
        showAlert('success', 'User assigned to class Successfuly')
        queryClient.invalidateQueries(['getStaff'])
        // props.setmodal(false)
        console.log(data)
      },
      onError: (error:any) => {
                 
        showAlert('error', 'An Error Occured' )
        
      }
    }
  );
  useEffect(()=>{
    if(isSuccess){
      setItems(data)
    }
  }, [isSuccess, data])
  const [filteredItems, setFilteredItems] = useState<any>(items);
  useEffect(() => {
    setFilteredItems(() => {
      return items.filter((item:any) => {
        return item.first_name.toLowerCase().includes(search.toLowerCase()) || item.last_name.toLowerCase().includes(search.toLowerCase());
      });
    });
  }, [search, items]);
  const roles: any = [
    { value: 'Class Teacher', label: 'Class Teacher' },
    { value: 'Staff Assistant', label: 'Staff Assistant' },
    { value: 'Counselor', label: 'Counselor' },
  ];
    
  return(

    <div className="mb-5 space-y-5 mt-8">
      <form className="mx-auto w-full sm:w-1/2 mb-5">
        <div className="relative">
          <input
            type="text"
            value={search}
            placeholder={`Search ${props.student? 'Students': 'Employees'} ...`}
            className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className="btn btn-primary absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>


          </button>
        </div>
      </form>
      <div>
        <div className="p-4 space-y-4 overflow-x-auto w-full block">
          {filteredItems?filteredItems.map((item: any) => {
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#1b2e4b] rounded-xl border mx-auto p-3 grid grid-cols-2 items-center gap-10
                        text-gray-500 font-semibold w-[90%] hover:text-primary transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="user-profile flex gap-8 items-center">
                  <img src={`/assets/images/profile-${Math.round(Math.random() * 35)}.jpeg`} alt="img" className="w-8 h-8 rounded-md object-cover" />
                  <div>{item.first_name + ' ' + item.last_name}</div>
                </div>
                <div className='w-full'>
                  <Select defaultValue='Select a Role' options={roles} isSearchable={false} onChange={(e:any)=>{
                    let data = {
                      user: item.id,
                      class_id: props.classData.id,
                      role:e.value,
                      // first_name: item.first_name,
                      // last_name: item.last_name,
                    }
                    mutate(data)}}/>

                </div>
        
              </div>
            );
          }): <p>{`${isLoading?'Loading items ...':'xxx'}`}</p>}
        </div>
      </div>
    
    </div>
  )
}

export default ClassUserAssignment