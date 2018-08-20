import * as React from "react";
import styled from "styled-components";


const Label = styled.label`
    display: block;
    padding: 0.5rem 0.5rem 0 0;
`;
const Input = styled.input``;


interface FormInputProps {
    label: string;
    name?: string;
    value: string;
    onChange(event: React.SyntheticEvent<HTMLInputElement>): void;
}

const FormInput = ({ label, name, value, onChange }: FormInputProps) => (
    <Label>
        {label}{" "}
        <Input name={name} value={value} onChange={onChange} />
    </Label>
);

export default FormInput;