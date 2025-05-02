'use client'

import {useEffect, useState} from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ColumnDataTypeDefinition from './ColumnDataTypeDefinition';
import {SchemaType, SchemaDefinition} from '@/utils/types'
import { UpdateSchema, getSchema } from '@/utils/fileActions';
import { useGlobalContext } from '@/context/context';
import SmallLoading from '../SmallLoading';



const DefineSchema = ({
    setShowOverlay, 
    schemaDefinition,
    setStep,
    step
}:{
    setShowOverlay:React.Dispatch<boolean>,
    schemaDefinition:SchemaType | null,
    setStep:React.Dispatch<number>,
    step:number
}) => {
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [schemaTypeDefinition, setSchemaTypeDefinition] = useState<SchemaDefinition>({});
    const [fileId, setFileId] = useState<string>("");
    const [awareness, setAwareness] = useState('');
    const {cleanDataFileId} = useGlobalContext();

    useEffect(() => {
        setLoadingPage(true);
        if(schemaDefinition?.schema_definition){
            setSchemaTypeDefinition(schemaDefinition.schema_definition);
            setFileId(schemaDefinition.file_id);
        }else{
            const fetchSchema = async() => {

                const response = await getSchema(cleanDataFileId);

                if(response){
                    setSchemaTypeDefinition(response?.data.result[0].schema_definition);
                    setFileId(response?.data.result[0].file_id);
                    setAwareness(response?.data.result[0].awareness);
                }
                
            }

            if(cleanDataFileId)
                fetchSchema();
            
            
        }
        setLoadingPage(false);
    }, [schemaDefinition, cleanDataFileId]);

    const handleSave = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        await UpdateSchema({file_id:fileId,schema_definition:schemaTypeDefinition,awareness:awareness});
        setLoading(false);
        setShowOverlay(false);
        setStep(1);
    }

    return (
        <div className='sectionBg w-full rounded-lg'>
            {
                loadingPage
                ? <SmallLoading/>
                :(
                    <form onSubmit={handleSave} method='POST' className='w-full gap-8'>
                        <div className='flex flex-col gap-8 w-full p-6'>
                            {
                                (step ===2) && (
                                    <div>
                                        <label className='heading font-bold text-lg inline-block'>Tell us about the data <small className='para text-green-600'>(recommended)</small></label>
                                        <div className='mb-2'><small className='para'>Providing data details enhances error detection and cleaning.</small></div>
                                        <textarea 
                                            name='description' 
                                            rows={5} 
                                            placeholder='Explore more about the data purpose structure and benefits' 
                                            className='w-full p-2 secondaryBg rounded-md focus:outline-none' 
                                            value={awareness} 
                                            onChange={(e) => setAwareness(e.target.value)}
                                        >
                                        </textarea>
                                    </div>
                                )
                            }
                            {
                                (step === 3) && <>
                                    <label className='heading font-bold text-lg inline-block mb-2'>Define Columns Schema <small className='para'>(optional)</small></label>
                                    <ColumnDataTypeDefinition SchemaDefinition={schemaTypeDefinition} setSchemaDefinition={setSchemaTypeDefinition} setLoading={setLoading}/>
                                </>
                            }

                        </div>
                        {/* Form Buttons */}
                        <div className='flex gap-3 justify-end items-center pr-3 pb-3 border-t pt-3 sectionBg sticky bottom-0 shadow'>
                            <button 
                                type="button" 
                                className='secondaryBtn flex gap-3 items-center' 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowOverlay(false);
                                    setStep(1);
                                }}
                            >
                                Cancel
                            </button>
                            {
                                (step === 3) && (
                                    <button 
                                        type="button" 
                                        className='transparentBtn flex gap-3 items-center' 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setStep(2);
                                        }}
                                    >
                                        Back
                                    </button>
                                )
                            }
                            {
                                (step === 3) && (
                                    <button type='submit' className='primaryBtn flex gap-3 items-center' disabled={loading}>
                                        {loading && (
                                            <AiOutlineLoading3Quarters className='animate-spin text-xl' />
                                        )} Save
                                    </button>
                                )
                            }
                            {
                                (step === 2) && (
                                    <button 
                                        type="button" 
                                        className='primaryBtn flex gap-3 items-center' 
                                        disabled={loading} 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setStep(3);
                                        }}
                                    >
                                        {loading && (
                                            <AiOutlineLoading3Quarters className='animate-spin text-xl' />
                                        )} Next
                                    </button>
                                )
                            }

                        </div>

                    </form>
                )
            }
        </div>
    )
}

export default DefineSchema