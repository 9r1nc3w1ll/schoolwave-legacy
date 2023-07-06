

export default function AttendanceTablet (props: any){

  return(
    <form className={`max-w-[220px] bg-${props.user.present? 'primary': 'black'}-light shadow-md p-2 rounded-sm hover:shadow-sm`}>
      <div className="flex gap-2 mb-2">
        <input type='checkbox' className="" checked={props.user.present} onChange={()=>{
          console.log(props.user)
        }}/>
        <h1>{props.user.first_name + ' ' + props.user.last_name }  </h1>
      </div>
      <div>
        <select className="form-select text-white-dark" defaultValue=''>
          <option>Remark</option>
          <option>Unexcused</option>
          <option>Excused</option>
          <option>Late</option>
          <option>Punctual</option>
        </select>
      </div>
    </form>

  )
}