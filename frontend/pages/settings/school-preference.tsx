import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from 'react-query';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Select from 'react-select';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { getSession } from '@/apicalls/session';
import { forEach } from 'lodash';


const MySwal = withReactContent(Swal)

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  username: string;
};

interface FormResponse {
  ok: boolean;
  token: string;
}
const Step1  = (props:any) => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState('basic')
  const [SessionList, setSessionList] = useState<any>([])


  useEffect(()=>{
    async function x (){
      let SessionDetails = await getSession(props.user_session?.access_token)
      if(SessionDetails.status == 'success'){
        let z:any = []
        SessionDetails.data.forEach((session:any)=>{
          z.push({value:session.name, label:session.name})
        })
      
        setSessionList(z)
      }
    }
    x()
   

  }, [])
  const [images, setImages] = useState<any>([]);
  const maxNumber = 69;

  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    setImages(imageList as never[]);
  };



  const options4 = [
    { value: '1st Term', label: '1st Term' },
    { value: '2nd Term', label: '2nd Term' },
    { value: '3rd Term', label: '3rd Term' },
  
  ];
  useEffect(() => {
    dispatch(setPageTitle('Contact Form'));
  });
  const router = useRouter();
  const { mutateAsync, isLoading, error } = useMutation<Response, unknown, FormValues, unknown>(
    (post) =>
      fetch(`${process.env.NEXT_PUBLIC_NEXT_PUBLIC_BACKEND_URL}/api/auth/user_onboarding/`, {
        method: "POST",
        body: JSON.stringify(post),
        headers: { "Content-Type": "application/json" }
      }),
    {
      onSuccess: async (data) => {
        MySwal.fire({
          confirmButtonText: 'Next Step',
          html: <div className='w-3/5 mx-auto center'> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-success mx-auto">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        
          <p className='text-success text-center'>User Created successfully </p></div> ,
   
        }).then(()=>{
          router.push('/onboarding/step2')
        });
      },
      onError: (error) => {
        MySwal.fire({
          title: "An Error Occured"
        })
      }
    }
  );

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>();  
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    data.username = data.email
    const { token }: FormResponse = await  (await mutateAsync(data)).json();
  }

  return (
    <div>
      <div className="panel">
     
        <h5 className="mb-5 text-lg font-semibold dark:text-white-light">School Preference</h5>
        <div className='grid grid-cols-6 gap-5 '>
          <ul className='panel col-span-1'>
            <li className= {`cursor-pointer mb-4 ${currentTab == 'basic'? 'text-primary' : ''}`} onClick={()=>setCurrentTab('basic')}> {'>'} Basic Details</li>
            <li className= {`cursor-pointer mb-4 ${currentTab == 'session'? 'text-primary' : ''}`} onClick={()=>setCurrentTab('session')}> {'>'} Session Details  </li>
            <li className= {`cursor-pointer mb-4 ${currentTab == 'email'? 'text-primary' : ''}`} onClick={()=>setCurrentTab('email')}> {'>'} Email Settings </li>
          </ul>
          <div className='col-span-5'>
            {currentTab=='basic'?
              <form className="space-y-5 ">
                <div className="flex sm:flex-row flex-col">
                  <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
            School Name
                  </label>
                  <input id="School Name" type="text" placeholder="School Name" className="form-input flex-1" />
                </div>

                <div className="flex sm:flex-row flex-col">
                  <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
            Email
                  </label>
                  <input id="horizontalEmail" type="email" placeholder="Enter Email" className="form-input flex-1" />
                </div>
                <div className="flex sm:flex-row flex-col">
                  <label htmlFor="horizontalPassword" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
            Phone Number
                  </label>
                  <input id="phoneNumber" type="number"  className="form-input flex-1" />
                </div>
                <div className="flex sm:flex-row flex-col">
                  <label htmlFor="horizontalPassword" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
          Currency
                  </label>
                  <input id="currency" type="text"  className="form-input flex-1" />
                </div>
                <div className="flex sm:flex-row flex-col">
                <label htmlFor="currencySymbol" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                      Currency Symbol
                    </label>
                    <select id="currencySymbol" className="form-select flex-1">
                      <option value="NGN">NGN (₦)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="CAD">CAD (C$)</option>
                      <option value="CHF">CHF (Fr)</option>
                      <option value="CNY">CNY (¥)</option>
                      <option value="SEK">SEK (kr)</option>
                      <option value="NZD">NZD (NZ$)</option>
                    </select>
                </div>
                <div className="flex sm:flex-row flex-col">
                  <label htmlFor="horizontalPassword" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
           City
                  </label>
                  <input id="city" type="text"  className="form-input flex-1" />
                </div>
                <div className="flex sm:flex-row flex-col">
                  <label htmlFor="horizontalPassword" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
          State
                  </label>
                  <input id="state" type="text"  className="form-input flex-1" />
                </div>
                <div className="flex sm:flex-row flex-col">
                  <label htmlFor="horizontalPassword" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
          Address
                  </label>
                  <textarea className='form-input flex-1'></textarea>
                </div>
                <div className="flex sm:flex-row flex-col">
                  <label htmlFor="horizontalPassword" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
           Language
                  </label>
                  <input id="language" type="text"  className="form-input flex-1" />
                </div>

                <div className="custom-file-container" data-upload-id="myFirstImage">
                  <div className="label-container">
                    <label>School Logo Upload </label>
                    <button
                      type="button"
                      className="custom-file-container__image-clear"
                      title="Clear Image"
                      onClick={() => {
                        setImages([]);
                      }}
                    >
            ×
                    </button>
                  </div>
                  <label className="custom-file-container__custom-file"></label>
                  <input type="file" className="custom-file-container__custom-file__custom-file-input" accept="image/*" />
                  <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                  <ImageUploading value={images} onChange={onChange} maxNumber={maxNumber}>
                    {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                      <div className="upload__image-wrapper">
                        <button className="custom-file-container__custom-file__custom-file-control" onClick={onImageUpload}>
                    Choose File...
                        </button>
                &nbsp;
                        {imageList.map((image, index) => (
                          <div key={index} className="custom-file-container__image-preview relative">
                            <img src={image.dataURL} alt="img" className="m-auto" />
                          </div>
                        ))}
                      </div>
                    )}
                  </ImageUploading>
                  {images.length === 0 ? <img src="/assets/images/file-preview.svg" className="max-w-md w-full m-auto" alt="" /> : ''}
                </div>
  
      
                <button type="submit" className="btn btn-primary !mt-6">
        Submit
                </button>
              </form>: ''}

            {currentTab=='session'?
              <form>
                <label>Current Session</label>
                <Select placeholder={SessionList[0].value} options={SessionList} />

                <label className='mt-8'>Current Term</label>
                <Select placeholder={options4[0].value} options={options4} />

                <label className='mt-8'>Preferred Name for a School year (e.g Session, Year, Grade e.t.c)</label>
                <input type='text' className='form-input'/>

                <label className='mt-8'>Preferred Name for a Term (e.g Term, Semester e.t.c)</label>
                <input type='text' className='form-input'/>
              </form>
              
              : ''}

              
          </div>
        </div>
      </div>
    </div>

  );
};



export default Step1;