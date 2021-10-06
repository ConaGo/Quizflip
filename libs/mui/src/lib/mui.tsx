import styled from 'styled-components';

/* eslint-disable-next-line */
export interface MuiProps {}

const StyledMui = styled.div`
  color: pink;
`;

export function Mui(props: MuiProps) {
  return (
    <StyledMui>
      <h1>Welcome to mui!</h1>
    </StyledMui>
  );
}

export default Mui;
