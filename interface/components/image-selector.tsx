import styled from 'styled-components';
import * as utils from '../utils';
import * as React from 'react';
import { Card } from './card';

const Container = styled(Card)`
  background-image: linear-gradient(to bottom right, rgb(100, 118, 214), rgb(35, 61, 203));
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Text = styled.p`
  color: ${(props) => props.theme.light_grey};
  font-weight: bold;
`;

const SelectButton = styled.div`
  background-image: linear-gradient(to bottom right, rgb(135, 149, 233), rgba(71, 94, 218, 1));
  display: flex;
  border-radius: 5px;
  box-shadow: 0 5px 20px 1px rgb(19, 42, 165, 0.6);
  padding: 5px;
  cursor: pointer;
  color: ${(props) => props.theme.light_grey};
  transition: all 0.1s ease;

  :hover {
    box-shadow: 0 5px 30px 2px rgb(19, 42, 165, 0.6);
    opacity: 0.8;
  }
`;

type Props = {
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
    <Container>
      <Text>Drop an image or</Text>

      <SelectButton style={{ marginLeft: 10 }} onClick={selectFile}>
        select one
      </SelectButton>

      <input type="file" id="file-selector" style={{ display: 'none' }} onChange={handleFileSelected} />
    </Container>
  );
};
