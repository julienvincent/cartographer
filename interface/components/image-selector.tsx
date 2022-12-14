import styled from 'styled-components';
import * as utils from '../utils';
import * as React from 'react';

const Container = styled.div<{ dragging: boolean }>`
  display: flex;
  flex-direction: column;
  border: 2px dashed ${(props) => (props.dragging ? props.theme['dark-blue'] : props.theme['dark-purple'])};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Error = styled.p`
  color: ${(props) => props.theme['light-red']};
  border: 2px dashed ${(props) => props.theme['dark-red']};
  font-weight: bold;
  padding: 10px;
  max-width: 300px;
  margin-top: 20px;
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
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleFile = async (file: File) => {
    const image_data = await utils.extractImageDataFromFile(file);

    if (image_data.width < 128 || image_data.height < 128) {
      setError(
        `Provided image is too small. You need to select an image of at least 128x128 pixels. Provided image has a dimension of ${image_data.width}x${image_data.height} pixels`
      );
      return;
    }

    props.onFileSelected(image_data);
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    handleFile(file);
  };

  React.useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const file = e.clipboardData?.files[0];
      if (!file) {
        return;
      }
      handleFile(file);
    };
    document.addEventListener('paste', handler);
    return () => {
      document.removeEventListener('paste', handler);
    };
  }, []);

  const selectFile = () => {
    document.getElementById('file-selector')?.click();
  };

  return (
    <Container
      style={props.style}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (!file) {
          return;
        }
        handleFile(file);
      }}
      dragging={dragging}
    >
      <Content>
        <Text>Drop, Paste or</Text>

        <SelectButton style={{ marginLeft: 10, marginRight: 10 }} onClick={selectFile}>
          Select
        </SelectButton>

        <Text>an image</Text>
      </Content>

      {!!error && <Error>{error}</Error>}

      <input type="file" id="file-selector" style={{ display: 'none' }} onChange={handleFileSelected} />
    </Container>
  );
};

export default ImageSelector;
