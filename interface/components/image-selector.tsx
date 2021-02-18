import styled from 'styled-components';
import * as React from 'react';

const Container = styled.div`
  display: flex;
  border: 3px dashed ${(props) => props.theme.blue};
  padding: 10px 15px;
`;

const SelectButton = styled.p`
  color: ${(props) => props.theme.light_blue};
  cursor: pointer;
  :hover {
    color: ${(props) => props.theme.blue};
  }
`;

type Props = {
  onFileSelected: (file: File) => void;
};

export const ImageSelector: React.FC<Props> = (props) => {
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    props.onFileSelected(file);
  };

  const selectFile = () => {
    document.getElementById('file-selector')?.click();
  };

  return (
    <Container>
      <p>Drop an image or</p>

      <SelectButton style={{ marginLeft: 5 }} onClick={selectFile}>
        select one
      </SelectButton>

      <input
        type="file"
        id="file-selector"
        style={{ visibility: 'hidden' }}
        onChange={handleFileSelected}
      />
    </Container>
  );
};
