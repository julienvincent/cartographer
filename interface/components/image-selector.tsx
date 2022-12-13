import styled from 'styled-components';
import * as utils from '../utils';
import * as React from 'react';

const Container = styled.div`
  display: flex;
  border: 2px dashed ${(props) => props.theme['dark-purple']};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Text = styled.p`
  color: ${(props) => props.theme.fg2};
  font-weight: bold;
`;

const SelectButton = styled.div`
  display: flex;
  padding: 5px;
  cursor: pointer;
  color: ${(props) => props.theme['light-yellow']};
  background-color: ${(props) => props.theme.bg4};
  transition: all 0.1s ease;

  :hover {
    opacity: 0.8;
  }
`;

type Props = {
  style?: React.CSSProperties;
  onFileSelected: (image_data: ImageData) => void;
};

export const ImageSelector: React.FC<Props> = (props) => {
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const image_data = await utils.extractImageDataFromFile(file);
    props.onFileSelected(image_data);
  };

  const selectFile = () => {
    document.getElementById('file-selector')?.click();
  };

  return (
    <Container style={props.style}>
      <Text>Drop an image or</Text>

      <SelectButton style={{ marginLeft: 10 }} onClick={selectFile}>
        select one
      </SelectButton>

      <input type="file" id="file-selector" style={{ display: 'none' }} onChange={handleFileSelected} />
    </Container>
  );
};

export default ImageSelector;
