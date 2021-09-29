import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router';
import { makeStyles, Button, Box } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { LeadTable } from './LeadTable';
import ButtonPrimary from './ButtonPrimary';
import Header from './Header';
import PaginationControl from './PaginationControl';
import { API_HOST } from '../config';

export const useStyles = makeStyles((theme) => ({
  // TODO: make custom roundButton component
  roundButton: {
    width: '50px',
    height: '50px',
    background: theme.palette.primary.dark,
    color: '#fff',
    borderRadius: '100px',
    margin: '0 5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  aboutFooter: {
    position: 'fixed',
    bottom: '0',
    width: '100%',
    height: '50px',
    fontSize: '1.2em',
    color: '#fff',
    textTransform: 'capitalize',
    background: theme.palette.primary.main,
    borderRadius: '0px',
  },
  pageSelect: {
    display: 'flex',
  },
  paginationTextField: {
    width: '115px',
  },
  leadTable: {
    border: '2px solid #E14E54',
  },
  leadTableHeader: {
    background: theme.palette.primary.main,
  },
  columnName: {
    color: '#fff',
  },
}));

export default function Home() {
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [perpage, setPerpage] = useState(10);
  const [leads, setLeads] = useState([]);

  const history = useHistory();

  // TODO: setup search and tags
  // const [search, setSearch] = useState(null);
  // const [tag, setTag] = useState(null);

  useEffect(() => {
    const url = `${API_HOST}/leads?page=${page}&perpage=${perpage}`;
    const token = localStorage.getItem('partnerFinderToken');
    if (!token) {
      history.push('/login');
    }
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          history.push('/login');
        } else {
          return response.json();
        }
      })
      .then((data) => setLeads(data.leads));
  }, [page, perpage]);

  return (
    <div id="home">
      <Header />
      <Box
        marginX="15px" // TODO: there must be a cleaner way to get the margins
      >
        {/* Row containing "Add New" button and pagination controls */}
        <Box
          paddingY="30px"
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <ButtonPrimary marginRight="auto">Add New</ButtonPrimary>

          <PaginationControl
            page={page}
            perpage={perpage}
            maxpages={100}
            setPage={setPage}
            setPerpage={setPerpage}
          />
        </Box>
        <LeadTable leads={leads} />
      </Box>

      <Button className={classes.aboutFooter}>About</Button>
    </div>
  );
}
