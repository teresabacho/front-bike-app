import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { PhotoUpload } from '@/entities/Profile';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { createArticleActions, createArticleReducer } from '../../model/slice/createArticle.slice';
import { StateSchema } from '@/app/providers/StoreProvider';
import { uploadPhoto } from '../../model/services/uploadPhoto/UploadPhoto';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Avatar } from '@/shared/ui/redesigned/Avatar';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { Input } from '@/shared/ui/redesigned/Input';
import { Button } from '@/shared/ui/redesigned/Button';
import { createArticle } from '../../model/services/createArticle';

const initialReducers: ReducersList = {
    createArticle:createArticleReducer,
};
const CreateArticle = () => {

    const dispatch = useAppDispatch();

    const file = useSelector((state:StateSchema) => state.createArticle?.file)
    const article = useSelector((state:StateSchema) => state.createArticle)
    const url = useSelector((state:StateSchema) => state.createArticle?.img)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');


    console.log(article);

    const onChangeTitle = useCallback(
        (value: string) => {
            dispatch(createArticleActions.setTitle(value));
        },
        [dispatch],
    );
    const onChangeSubtitle = useCallback(
        (value: string) => {
            setTitle(value)
        },
        [],
    );
    const onChangeDescription = useCallback(
        (value: string) => {
            setDescription(value)
        },
        [],
    );



    const onChangeAvatar = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files && event.target.files[0]){
                dispatch(createArticleActions.setFile(event.target.files[0]));
            }
        },
        [dispatch],
    );

    const onFileUpload = async () => {
        const formData = new FormData();
        if (file){
            formData.append("file", file);
            dispatch(uploadPhoto({file:formData}))
        }
    };

    return (
        <div>
            <DynamicModuleLoader removeAfterUnmount reducers={initialReducers} >
                <VStack max gap="32" >
                    <HStack gap="32" max justify="between" >
                        Загрузіть фото
                        <Avatar size={128} src={url || "https://www.hundeo.com/wp-content/uploads/2019/05/Shiba-Inu-Profilbild.jpg"} />
                        <PhotoUpload onChangeAvatar={onChangeAvatar} onFileUpload={onFileUpload} />
                    </HStack>
                    <HStack gap="32" max>
                         Встановіть тайтл
                        <Input onChange={onChangeTitle} />
                    </HStack>
                    <VStack gap="32" max>
                        Встановіть загаловок блоку
                        <Input width="30px" onChange={onChangeSubtitle} />
                        Встановіть опис блоку
                        <Input width="4000px"  onChange={onChangeDescription} />
                        <Button onClick={()=>{dispatch(createArticleActions.setDescription({title, description}))}}>Зберегти</Button>
                    </VStack>
                    <Button disabled={!article?.blocks.length || !article?.img || !article?.title}
                            onClick={()=>{dispatch(createArticle({blocks:article?.blocks, img: article?.img, title: article?.title }))}}>Відправити</Button>
                </VStack>
            </DynamicModuleLoader>



        </div>
    )
};

export default CreateArticle;
