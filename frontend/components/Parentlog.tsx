import FormGroup from '@mui/material/FormGroup';
import { FormControlLabel } from '@mui/material';
import { Switch } from '@mui/material';

const ParentLog = () => {

   

    return(
        <div className="panel">
                    <h5 className="mb-5 text-lg font-semibold dark:text-white-light">Login details</h5>

                    <FormGroup className="space-y-5">
                        <div>
                            <label htmlFor="groupFname">First Name</label>
                            <input id="groupFname" type="text" placeholder="Enter First Name" className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="groupLname">Last Name</label>
                            <input id="groupLname" type="text" placeholder="Enter Last Name" className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="groupLname">Email</label>
                            <input id="groupLname" type="email" placeholder="Enter Last Name" className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="groupLname">Password</label>
                            <input id="groupLname" type="password" placeholder="Enter Last Name" className="form-input" />
                        </div>
                        <div className=' flex gap-5 justify-items-stretch'>
                        <button type="button" className="btn btn-primary !mt-6">
                            Submit
                        </button>

                        <FormControlLabel control={<Switch defaultChecked />} label="Disable" className='justify-end  w-full mt-5' />

                        </div>
                       
                       

                        

                    </FormGroup>
       

</div>
);
};
export default ParentLog

