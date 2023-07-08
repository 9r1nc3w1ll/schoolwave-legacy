import { AssignStaffToSubject, getSingleSubject } from '@/apicalls/subjects';
import { getAllStaffs } from '@/apicalls/staffs';
import { getRoles } from '@/apicalls/roles';
import { showAlert } from '@/utility_methods/alert';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Select from 'react-select';
import { active } from 'sortablejs';
import CheckboxWithState from './CheckboxWithState';
import Option from 'react-select/dist/declarations/src/components/Option';
import { AnyARecord } from 'dns';




const SubjectUserAssignments = (props: any) => {


  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<{ value: string }[]>([]);
  const [roles, setRoles] = useState<{ value: string }[]>([]);
  const { data: staffsDetails, isSuccess: teachersSuccess, isLoading: teachersLoading, refetch:refetchTeacher } = useQuery('getAllStaffs', async () => {
    return getAllStaffs (props.user_session.access_token);
  });
  const { data: roleDetails, isSuccess: rolesSuccess, isLoading: rlesLoading, refetch:refetchRole } = useQuery('getAllRoles', async () => {
    return getRoles (props.user_session.access_token);
  });
  

  const queryClient = useQueryClient();

  const { mutate, error } = useMutation(
    (data: any) =>
      AssignStaffToSubject(data, props.user_session.access_token),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Staff assigned to subject successfully');
        queryClient.invalidateQueries('AssignStafftoSubeject');
        props.refreshClasses()
        props.exit(false)
        
        

      },
      onError: (error: any) => {
        showAlert('error', 'An Error Occurred');
      }
    }
  );
 
 

  useEffect(() => {
    if (teachersSuccess && rolesSuccess) {
      // setItems(teachersData);
      // refetchTeacher()
      // refetchRole()
      setItems(staffsDetails.data),
      setRoles(roleDetails)
      
      
    } 
  }, [teachersSuccess,staffsDetails]);

    
  let options:any = [];
  let roles_option:any =[];


  if (teachersSuccess && rolesSuccess) {
     

    options = items.map((item:any) => ({
      
      label: item.id,
      value: item.id,
    }))

    roles_option = roles.map((role:any)=>({
      
      label:role.name,
      value:role.id,
    }))

    ;
  }


  const [staffValue, setStaffValue] = useState(null);
  const [roleValue, setRoleValue] = useState(null);
  
  
  const handleStaffChange = (selectedOption:any) => {
    setStaffValue(selectedOption);
    
  };
  
  
  const handleRoleChange = (selectedOption:any) => {
    setRoleValue(selectedOption); 
   
  };
   
  const handleSubmit = (event:any) => {
    event.preventDefault();

  
      let data = {
        subject: props.classData.id,
        subject_name: props.classData.name,
        staff: (staffValue as any)?.value,
        role: (roleValue as any)?.value,
        active: true
      };



    // Additional logic to handle the selected optio
    
    mutate(data);
  };

 

  const defaultValue = options.length > 0 ? options[0] : null;
  const defaultRole = roles_option.length > 0? roles_option[0]: null;

 

   

  return (
    <div className="mb-5 space-y-5 mt-8 min-h-[30vh]  overflow-y-auto">
       <div className=' border-b w-full' >
        <p className='text-base  text-left p-2'> Assign a Staff to:  <span className='text-blue-600 font-bold'>{props.classData.name}</span> </p>
        </div>
      
       
        <div className="p-4  w-full ">
         
           
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
  <div className="bg-white dark:bg-[#1b2e4b] rounded-xl border p-3 mb-5 flex items-center gap-4">
    <div className="user-profile font-semibold">Staff:</div>
    <div className="w-full">
      <Select
        value={staffValue}
        options={options}
        isSearchable={false}
        defaultValue={defaultValue}
        onChange={handleStaffChange}
      />
    </div>
  </div>

  <div className="bg-white dark:bg-[#1b2e4b] rounded-xl border p-3 mb-5 flex items-center gap-4">
    <label htmlFor="role" className="user-profile font-semibold">Role:</label>
    <div className="w-full">
      <Select
        id="staff"
        value={roleValue}
        options={roles_option}
        isSearchable={false}
        defaultValue={defaultRole}
        onChange={handleRoleChange}
      />
    </div>
  </div>

  <div className="flex justify-center">
    <button className="btn btn-primary" type="submit">Save</button>
  </div>
</form>

                

               
           </div>
        </div>
      
   
  );
}

export default SubjectUserAssignments;
