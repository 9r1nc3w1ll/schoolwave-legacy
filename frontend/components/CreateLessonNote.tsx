import { CreateLesssonNote } from "@/apicalls/lesson-notes"
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useMutation, useQueryClient, useQuery } from 'react-query';
import { showAlert } from "@/utility_methods/alert";

const CreateLesssonForm =(props:any)=>{

  const { status: sessionStatus, data: user_session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Subject'));
  });


const {register, reset, handleSubmit} = useForm ({shouldUseNativeValidation:true});

    const queryClient = useQueryClient();
    const {mutate, isLoading, error } = useMutation(
      (data:any) =>{

        return  CreateLesssonNote(user_session?.access_token, data )},
        {
          onSuccess: async (data) => {
            showAlert('success', 'Questions created Successfully')
            reset();

          },
          onError: (error) => {
            showAlert('error', 'An Error Occured' )
          },
        }
    );
    const onSubmit = async (data: any) => {
      const extractedQuestions = selectedQuestions.map((value: any) => value.value);
      const updatedData = { ...data, subjects: extractedQuestions };
    
      mutate(updatedData);
    };


    return(
<div>
        <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
        {params.id ? 'Edit Note' : 'Add Note'}
      </div>
      <div className="p-5">
        <form>
          <div className="mb-5">
            <label htmlFor="title">Title</label>
            <input id="title" type="text" placeholder="Enter Title" className="form-input" value={params.title} onChange={(e) => changeValue(e)} />
          </div>
          <div className="mb-5">
            <label htmlFor="name">User Name</label>
            <select id="user" className="form-select" value={params.user} onChange={(e) => changeValue(e)}>
              <option value="">Select User</option>
              <option value="Max Smith">Max Smith</option>
              <option value="John Doe">John Doe</option>  
              <option value="Kia Jain">Kia Jain</option>
              <option value="Karena Courtm,liff">Karena Courtliff</option>
              <option value="Vladamir Koschek">Vladamir Koschek</option>
              <option value="Robert Garcia">Robert Garcia</option>
              <option value="Marie Hamilton">Marie Hamilton</option>
              <option value="Megan Meyers">Megan Meyers</option>
              <option value="Angela Hull">Angela Hull</option>
              <option value="Karen Wolf">Karen Wolf</option>
              <option value="Jasmine Barnes">Jasmine Barnes</option>
              <option value="Thomas Cox">Thomas Cox</option>
              <option value="Marcus Jones">Marcus Jones</option>
              <option value="Matthew Gray">Matthew Gray</option>
              <option value="Chad Davis">Chad Davis</option>
              <option value="Linda Drake">Linda Drake</option>
              <option value="Kathleen Flores">Kathleen Flores</option>
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="tag">Tag</label>
            <select id="tag" className="form-select" value={params.tag} onChange={(e) => changeValue(e)}>
              <option value="">None</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="social">Social</option>
              <option value="important">Important</option>
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="desc">Description</label>
            <textarea
              id="description"
              rows={3}
              className="form-textarea min-h-[130px] resize-none"
              placeholder="Enter Description"
              value={params.description}
              onChange={(e) => changeValue(e)}
            ></textarea>
          </div>
          <div className="mt-8 flex items-center justify-end">
            <button type="button" className="btn btn-outline-danger gap-2" onClick={() => setAddContactModal(false)}>
                                            Cancel
            </button>
            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveNote}>
              {params.id ? 'Update Note' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>

      </div>
    )
}

export default CreateLesssonForm