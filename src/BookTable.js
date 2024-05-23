import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, TablePagination, Paper, TextField, Button, Modal, Box
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { CSVLink } from "react-csv";

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [editBook, setEditBook] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [page, rowsPerPage, order, orderBy, searchQuery]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://openlibrary.org/subjects/science_fiction.json', {
        params: {
          limit: rowsPerPage,
          offset: page * rowsPerPage,
          q: searchQuery
        }
      });
      setBooks(response.data.works);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (book) => {
    setEditBook(book);
    setOpen(true);
  };

  const handleSaveClick = () => {
    setOpen(false);
    setEditBook(null);
  };

  const sortedBooks = books.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    }
    return a[orderBy] > b[orderBy] ? -1 : 1;
  });

  const handleClose = () => {
    setOpen(false);
    setEditBook(null);
  };

  return (
    <Paper >
      <CSVLink
        data={books}
        headers={[
          { label: "Title", key: "title" },
          { label: "Author Name", key: "author_name" },
          { label: "First Publish Year", key: "first_publish_year" },
          { label: "Subject", key: "subject" },
          { label: "Ratings Average", key: "ratings_average" },
          { label: "Author Birth Date", key: "author_birth_date" },
          { label: "Author Top Work", key: "author_top_work" },
        ]}
        filename="books.csv"
        style={{ textDecoration: 'none', margin: 16 }}
      >
        <Button variant="contained" color="primary" style={{marginLeft:'60rem',marginBottom:'2rem',marginTop:'2rem'}}>Download CSV</Button>
      </CSVLink>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {['Title', 'Author_name', 'First_publish_year', 'Subject', 'Ratings_average', 'Author_birth_date', 'Author_top_work'].map((column) => (
                <TableCell
                key={column}
                sx={{ borderTop: '1px solid #e0e0e0' }}
                >
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : 'asc'}
                    onClick={() => handleRequestSort(column)}
                  >
                    {column.replace(/_/g, ' ')}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBooks.map((book) => (
              <TableRow key={book.key}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.authors?.map(author => author.name).join(', ')}</TableCell>
                <TableCell>{book.first_publish_year}</TableCell>
                <TableCell>{book.subject}</TableCell>
                <TableCell>{book.ratings_average}</TableCell>
                <TableCell>{book.author_birth_date}</TableCell>
                <TableCell>{book.author_top_work}</TableCell>
                <TableCell>
                  <EditIcon onClick={() => handleEditClick(book)} style={{ cursor: 'pointer' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination 
        style={{marginBottom:'2rem'}}
        rowsPerPageOptions={[10, 50, 100]}
        component="div"
        count={100} // total count should be dynamic
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box sx={{ width: 400, p: 4, margin: 'auto', mt: '10%', backgroundColor: 'white', borderRadius: 1 }}>
          <h2>Edit Book</h2>
          {editBook && (
            <>
              <TextField
                label="Title"
                value={editBook.title}
                onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Author Name"
                value={editBook.authors?.map(author => author.name).join(', ')}
                onChange={(e) => setEditBook({ ...editBook, authors: e.target.value.split(',').map(name => ({ name })) })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="First Publish Year"
                value={editBook.first_publish_year}
                onChange={(e) => setEditBook({ ...editBook, first_publish_year: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Subject"
                value={editBook.subject}
                onChange={(e) => setEditBook({ ...editBook, subject: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Ratings Average"
                value={editBook.ratings_average}
                onChange={(e) => setEditBook({ ...editBook, ratings_average: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Author Birth Date"
                value={editBook.author_birth_date}
                onChange={(e) => setEditBook({ ...editBook, author_birth_date: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Author Top Work"
                value={editBook.author_top_work}
                onChange={(e) => setEditBook({ ...editBook, author_top_work: e.target.value })}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveClick}
                style={{ marginTop: 16 }}
              >
                Save
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Paper>
  );
};

export default BookTable;
