import ClassSelect from './ClassSelect';
import DiscountSelect from './DiscountSelect';
import Select from 'react-select';
import { showAlert } from '@/utility_methods/alert';
import { useForm } from 'react-hook-form';
import { FeeTemplateFormValues, IClientError, RefinedFeeItem, SessionStatus, UserSession } from '@/types';
import { SetStateAction, useEffect, useState } from 'react';
import { createFeeTemplate, getFeeItems } from '@/apicalls/fees';
import { useMutation, useQuery } from 'react-query';

interface CreateFeeTemplateProps {
    user_session_status: SessionStatus;
    user_session: UserSession;
    exit: React.Dispatch<SetStateAction<boolean>>;
    refreshList: () => void;
}

const CreateFeeTemplate = (props: CreateFeeTemplateProps) => {
    const [feeItems, setFeeItems] = useState<RefinedFeeItem[]>([]);
    const [requiredItem, setRequiredItem] = useState<string[]>([]);
    const [optionalItem, setOptionalItem] = useState<string[]>([]);
    const { register, handleSubmit, reset } = useForm<FeeTemplateFormValues>({ shouldUseNativeValidation: true });
    const { data, refetch } = useQuery('feeitems', () => getFeeItems(props.user_session?.access_token), { enabled: false });

    useEffect(() => {
        if (props.user_session_status === 'authenticated') {
            refetch();
        }
    }, [props.user_session_status === 'authenticated']);

    useEffect(() => {
        let refinedFeeItems: RefinedFeeItem[] = [];

        if (data) {
            refinedFeeItems = data.data?.map((itm) => ({
                value: itm.id,
                label: itm.name,
            }));
        }

        console.log('refinedFeeitems: ', refinedFeeItems);
        setFeeItems(refinedFeeItems);
    }, [data]);

    const { mutate } = useMutation(createFeeTemplate, {
        onSuccess: async () => {
            showAlert('success', 'Fee Template Created Successfuly');
            props.refreshList();
            props.exit(false);
            reset();
        },
        onError: (error: IClientError) => {
            showAlert('error', error.message);
        },
    });

    const onSubmit = handleSubmit(async (tempData) => {
        mutate({
            data: {
                ...tempData,
                school: props.user_session?.school.id,
                required_items: requiredItem,
                optional_items: optionalItem,
                active: false,
            },
            accessToken: props.user_session?.access_token,
        });
    });

    return (
        <div className="">
            <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" className="form-input" {...register("name", { required: "This field is required" })} />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input id="description" type="text" className="form-input" {...register("description", { required: "This field is required" })} />
        </div>
        <div>
          <ClassSelect {...register("class_id", { required: "This field is required" })} user_session={props.user_session} triggerFetch= {props.user_session_status === "authenticated"} />
        </div>
        <div>
          <DiscountSelect {...register("discount")} trigger={props.user_session_status === "authenticated"} user_session={props.user_session} />
        </div>
        <div>
          <label htmlFor="name">Required Fee Items</label>
          <Select placeholder="Select an option" options={feeItems} isMulti isSearchable={true} onChange={(e) => {
            const dataofInterest: string[] = [];

                            e.forEach((itm) => {
                                dataofInterest.push(itm.value);
                            });
                            setRequiredItem(dataofInterest);
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="name">Optional Fee Items</label>
                    <Select
                        placeholder="Select an option"
                        options={feeItems}
                        isMulti
                        isSearchable={true}
                        onChange={(e) => {
                            const dataofInterest: string[] = [];

                            e.forEach((itm) => {
                                dataofInterest.push(itm.value);
                            });
                            setOptionalItem(dataofInterest);
                        }}
                    />
                </div>
                <div className="mx-auto mt-8 flex items-center justify-center">
                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateFeeTemplate;
