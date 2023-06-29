import { createTerm } from "@/apicalls/session";
import { showAlert } from "@/utility_methods/alert";
import { useMutation } from "react-query";

const CreateTerm =(props: any)=>{


  const { mutate, isLoading, error } = useMutation(
    (data: any) =>
      createTerm(props.user_session.access_token, data),
    {
      onSuccess: async (data) => {
        showAlert('success', 'Term updated Successfuly')
        props.exit(false)
      
    
      },
      onError: (error) => {
    
        showAlert('error', 'An Error Occured')
      }
    }
  );


  const save =(name: string, code: string)=>{
    let termData = {
      name: name,
      active: false,
      session: props.selectedSession,
      school: props.user_session?.school.id,
      code: code
    }
    mutate(termData)
  }

  return(
    <div className="mt-[30px]">
      <div className="mt-[15px]" >
        <h1>First Term</h1>
        <div className="md:flex gap-3 justify-between border p-4 mt-4 rounded">
          <div className=" w-1/3">
            <label className="text-sm">Start Date</label>
            <input type='date' className="form-input" /> </div>
          <div className=" w-1/3">
            <label className="text-sm">End  Date</label>
            <input type='date' className="form-input"/>
          </div>
          <div className=" w-1/3">

            <button className="btn btn-success mt-[10%] w-full" onClick={()=>{
              save('First Term','1st Term')
            }}>Save</button>
          </div>
        </div>
      </div>

      <div className="mt-[15px]" >
        <h1>Second Term</h1>
        <div className="md:flex gap-3 justify-between border p-4 mt-4 rounded">
          <div className=" w-1/3">
            <label className="text-sm">Start Date</label>
            <input type='date' className="form-input" /> </div>
          <div className=" w-1/3">
            <label className="text-sm">End  Date</label>
            <input type='date' className="form-input"/>
          </div>
          <div className=" w-1/3">

            <button className="btn btn-success mt-[10%] w-full" onClick={()=>{
              save('Second Term','2nd Term')
            }}>Save</button>
          </div>
        </div>
      </div>

      <div className="mt-[15px]" >
        <h1>Third Term</h1>
        <div className="md:flex gap-3 justify-between border p-4 mt-4 rounded">
          <div className=" w-1/3">
            <label className="text-sm">Start Date</label>
            <input type='date' className="form-input" /> </div>
          <div className=" w-1/3">
            <label className="text-sm">End  Date</label>
            <input type='date' className="form-input"/>
          </div>
          <div className=" w-1/3">

            <button className="btn btn-success mt-[10%] w-full" onClick={()=>{
              save('Third Term','3rd Term')
            }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTerm