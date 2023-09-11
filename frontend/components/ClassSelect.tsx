import { getClasses } from '@/apicalls/class-api';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Session } from 'next-auth';

interface ClassSelectProps<TFieldValues extends FieldValues> {
    register?: UseFormRegister<TFieldValues>;
    triggerFetch: boolean;
    class_selector?: string | any;
    user_session: Session | null;
}

const ClassSelect = <TFieldValues extends FieldValues>(props: ClassSelectProps<TFieldValues>) => {
    const { data: classes, refetch } = useQuery(
        'getClasses',
        () => {
            return getClasses(props.user_session?.access_token);
        },
        { enabled: false }
    );

    useEffect(() => {
        refetch();
    }, [props.triggerFetch]);

    return (
        <div className="mb-8">
            <label>Class</label>
            <select className="form-select text-white-dark" id="class" {...props.register!(props.class_selector ? props.class_selector : 'class', { required: 'This field is required' })}>
                <option value="">-- select One-- </option>
                {classes?.map((clss) => (
                    <option key={clss.id} value={clss.id}>
                        {' '}
                        {clss.name}{' '}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ClassSelect;
