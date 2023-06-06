import Dropdown from "./Dropdown";

const DropDownWIthChildren = (props:any) => {
  return (
    <div className="dropdown">
      <Dropdown
        placement='left-start'
        btnClassName="dropdown-toggle !flex"
        button={
          <>
            {props.trigger}
          </>
        }
      >
        {props.children}
      </Dropdown>
    </div>
  );
};
  
export default DropDownWIthChildren;
  