import React from 'react';
import { Container } from '@mui/material';
import BookTable from './BookTable';
import './App.css'

function App() {
  return (
    <Container>
      <p style={{textAlign:'center',color:'#f18070',fontSize:'2rem'}}>Admin Dashboard Table</p>
      <BookTable />
    </Container>
  );
}

export default App;
