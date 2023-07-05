import { AssignStaffToSubject, getSingleSubject } from '@/apicalls/subjects';
import {getAllUsers} from '@/apicalls/users';
import { showAlert } from '@/utility_methods/alert';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Select from 'react-select';
import { active } from 'sortablejs';
import CheckboxWithState from './CheckboxWithState';
import Option from 'react-select/dist/declarations/src/components/Option';

const SubjectUserAssignments = (props: any) => {


  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState<number>()
  const { data: teachersDetails, isSuccess: teachersSuccess, isLoading: teachersLoading, refetch:refetchTeacher } = useQuery('getAllUsers', async () => {
    return getAllUsers(props.user_session.access_token);
  });
  

  const queryClient = useQueryClient();
  const { mutate, error } = useMutation(
    (data: any) =>
      AssignStaffToSubject(data, props.user_session.access_token),
    {
      onSuccess: async (data) => {
        showAlert('success', 'User assigned to subject successfully');
        queryClient.invalidateQueries('getAllUsers');
        console.log(data)
        props.refreshClasses()
        

      },
      onError: (error: any) => {
        showAlert('error', 'An Error Occurred');
      }
    }
  );
 
 

  useEffect(() => {
    if (teachersSuccess) {
      // setItems(teachersData);
      setItems(teachersDetails.data)
      
    }
  }, [teachersSuccess, teachersDetails]);

  

  const [filteredItems, setFilteredItems] = useState<any>(items);
  useEffect(() => {
    setFilteredItems(() => {
      if (Array.isArray(items)) {
        return items.filter((item: any) => {
          return (
            item.first_name.toLowerCase().includes(search.toLowerCase()) ||
            item.last_name.toLowerCase().includes(search.toLowerCase())
          );
        });
      } 
    });
  }, [search, items]);

  interface Option{
    id:string;
    first_name:string;
    second_name:string;
  }
  

   

  return (
    <div className="mb-5 space-y-5 mt-8 min-h-[50vh] overflow-y-auto">
       <div className=' border-b w-full' >
        <p className='text-xl  text-left p-2'> Assign a Staff to:  <span className='text-blue-600 font-semibold'>{props.classData.name}</span> </p>
        </div>
      
       
        <div className="p-4  w-full ">
         
           
              
                <div
                  
                  className="bg-white dark:bg-[#1b2e4b] rounded-xl border mx-auto p-3 grid grid-cols-2 items-center gap-10
                  text-gray-500 font-semibold w-[90%] h-auto hover:text-primary transition-all duration-300 hover:scale-[1.01]" 
                >
                  
                  <div className="user-profile flex gap-8 items-center ">
                    <img src={`/assets/images/profile-${Math.round(Math.random() * 35)}.jpeg`} alt="img" className="w-8 h-8 rounded-md object-cover" />
                    <div>{props.classData.name}</div>
                  </div>
                  <div className='w-full'>
                    

                    <Select
                       defaultValue={{ value: '', label: 'Select a Teacher' }}
                       options={teachersSuccess
                         ? items.map((item: any) => ({
                             value: item.id,
                             label: `${item.first_name} ${item.last_name}`
                           }))
                         : []
                       }
                      isSearchable={false}
                      onChange={(e: any) => {

                        let data = {
                          subject: e.value,
                          staff: props.classData.id,
                          role: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                          active:true
                        
                        }
                        mutate(data)}}
                        
                      
                    />
                    
                  </div>      

                  
                </div>

                <div
                  
                  className="bg-white dark:bg-[#1b2e4b] rounded-xl border mx-auto p-3 grid grid-cols-2 items-center gap-10
                  text-gray-500 font-semibold w-[90%] h-auto hover:text-primary transition-all duration-300 hover:scale-[1.01]"
                >
                  
                  <div className="user-profile flex gap-8 items-center">
                    <img src={`/assets/images/profile-${Math.round(Math.random() * 35)}.jpeg`} alt="img" className="w-8 h-8 rounded-md object-cover" />
                    <div>{props.classData.name}</div>
                  </div>
                  <div className='w-full'>
                    

                    <Select
                      defaultValue='Select a Teacher'
                      options={teachersSuccess ? items.map((item:any) => ({ value: item.id, label: `${item.first_name} ${item.last_name}` })) : []}
                      isSearchable={false}
                      onChange={(e: any) => {

                        let data = {
                          subject: e.value,
                          staff: props.classData.id,
                          role: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                          active:true
                        
                        }
                        mutate(data)}}
                        
                      
                    />
                    
                  </div>

                  

                  
                </div>
           
        </div>
      </div>
   
  );
}

export default SubjectUserAssignments;
