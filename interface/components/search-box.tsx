import styled from 'styled-components';
import * as React from 'react';
import * as _ from 'lodash';

const Input = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 0;
  background-color: ${(props) => props.theme['bg0-soft']};
  border: 2px dashed ${(props) => props.theme['light-blue']};

  color: ${(props) => props.theme.fg0};

  :focus {
    border: 2px dashed ${(props) => props.theme.fg1};
    outline: none !important;
  }
`;

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBox: React.FC<Props> = (props) => {
  return <Input placeholder="Search" value={props.value} onChange={(e) => props.onChange(e.target.value)} />;
};

export default SearchBox;
