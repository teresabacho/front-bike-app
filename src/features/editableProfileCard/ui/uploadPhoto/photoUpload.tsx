import React from 'react';
import { Button } from '@/shared/ui/redesigned/Button';

type PhotoUploadProps = {
    onChangeAvatar:((event:React.ChangeEvent<HTMLInputElement>)=>void) | undefined,
    onFileUpload:any
}

export  function PhotoUpload(props:PhotoUploadProps) {
const {onChangeAvatar,onFileUpload} = props



    return (
        <div>
            <h2>Завантаження зображення</h2>
            <input type="file" onChange={onChangeAvatar} />
            <Button onClick={onFileUpload}>
                Завантажити!
            </Button>
        </div>
    );
}

