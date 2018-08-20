import styled from "styled-components";

const ThemeCell = styled.td`
    padding: 1rem 2rem 1rem 1rem;
    font-size: 1.5rem;
    
    @media(max-width: 450px) {
        font-size: 12pt;
        padding: 5px;
    }
`;

export default ThemeCell;