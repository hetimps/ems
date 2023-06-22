import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Modal,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { TableData } from "../redux/Login_slice";
import { Company } from "../string/MainString";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';


const columns = [

  { id: "checkbox", label: "", minWidth: 100 },
  { id: "Code", label: "Code", minWidth: 150 },
  { id: "Name", label: "Name", minWidth: 150 },
  { id: "Link", label: "Link", minWidth: 150 },
  { id: "Machines", label: "Machines", minWidth: 150 },
  { id: "Frequency", label: "Frequency", minWidth: 150 },
  { id: "Contact_Number", label: "Contact_Number", minWidth: 150 },
  { id: "Remark", label: "Remark", minWidth: 150 },
  { id: "action", label: "Action", minWidth: 100 },
  // { id: "Area", label: "Area", minWidth: 100 },

];

function createData(
  Code,
  Name,
  Link,
  Machines,
  Frequency,
  Contact_Number,
  Remark,
  _id,
  Area
) {
  return { Code, Name, Link, Machines, Frequency, Contact_Number, Remark, _id, Area };
}

export default function StickyHeadTable() {
  const [loading, setLoading] = useState(true);

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelect = (event, row) => {
    const selectedIndex = selectedRows.indexOf(row);
    let newSelectedRows = [];

    if (selectedIndex === -1) {
      newSelectedRows = [...selectedRows, row];
    } else {
      newSelectedRows = selectedRows.filter(
        (selectedRow) => selectedRow !== row
      );
    }

    setSelectedRows(newSelectedRows);
  };




  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const dispatch = useDispatch();

  // get data

  const [data, setData] = useState([]);

  const token = JSON.parse(localStorage.getItem("token"));

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://ec2-52-66-67-174.ap-south-1.compute.amazonaws.com:3107/user/get-store",
        {
          headers: {
            token: token,
          },
        }
      );

      setData(response.data.result);
      // console.log(response.data.result);

      setLoading(false);
      dispatch(TableData(response.data.result));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [rows, setrows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Transform the fetched data into the required row format
    const transformedData = data.map((item) =>
      createData(
        item.code,
        item.name,
        item.link,
        item.machines,
        item.frequency,
        item.contact_no,
        item.remark,
        item._id,
        item.area
      )
    );
    setrows(transformedData);

    // console.log(transformedData)
  }, [data]);




  // delete data
  const deleteRecord = async (recordId) => {
    console.log(recordId);

    try {
      const response = await axios.post(
        `http://ec2-52-66-67-174.ap-south-1.compute.amazonaws.com:3107/user/remove-company`,
        {
          ids: [recordId],
          // Send the _id in the request body
        },
        {
          headers: {
            token: token,
          },
        }
      );
      console.log(token);

      console.log("Delete response:", response.data.message);
      // Refetch data after successful deletion
      fetchData();
      setSearchValue("")

      if (
        response.data.message ===
        " you dont have permission to perform this.. !!"
      ) {
        toast.error(response.data.message, {
          position: "top-right",
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // add company

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#34485C",
    bgcolor: "background.paper",
    height: "660px",
    width: "819px",
    boxShadow: 24,
    p: 4,
  };

  const [openDialog, setOpenDialog] = useState(false); // Dialog open state

  const [newCompanyValues, setNewCompanyValues] = useState({
    code: "",
    name: "",
    machines: "",
    area: "",
    link: "",
    frequency: "",
    contact_no: "",
    remark: "",
  }); // State to store the new company form values
  console.log(newCompanyValues);

  const resetForm = () => {
    setNewCompanyValues({
      code: "",
      name: "",
      machines: "",
      area: "",
      link: "",
      frequency: "",
      contact_no: "",
      remark: "",
    });
    setErrors({});
    setHelperTexts({});
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };


  const [errors, setErrors] = useState({});
  const [helperTexts, setHelperTexts] = useState({});





  const handleSave = async () => {



    setErrors({});
    setHelperTexts({});

    let isValid = true;
    const newErrors = {};
    const newHelperTexts = {};

    if (!newCompanyValues.code.trim()) {
      newErrors.code = true;
      newHelperTexts.code = 'code field is required';
      isValid = false;
    }

    if (!newCompanyValues.name.trim()) {
      newErrors.name = true;
      newHelperTexts.name = "name field is required";
      isValid = false;
    }

    if (!newCompanyValues.machines.trim()) {
      newErrors.machines = true;
      newHelperTexts.machines = "machines field is required";
      isValid = false;
    }

    if (!newCompanyValues.area.trim()) {
      newErrors.area = true;
      newHelperTexts.area = "area field is required";
      isValid = false;
    }

    if (!newCompanyValues.link.trim()) {
      newErrors.link = true;
      newHelperTexts.link = "link field is required";
      isValid = false;
    }

    if (!newCompanyValues.frequency.trim()) {
      newErrors.frequency = true;
      newHelperTexts.frequency = "frequency field is required";
      isValid = false;
    }

    if (!newCompanyValues.contact_no.trim()) {
      newErrors.contact_no = true;
      newHelperTexts.contact_no = "contact_no field is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(newCompanyValues.contact_no.trim())) {
      newErrors.contact_no = true;
      newHelperTexts.contact_no = "contact number must be a 10-digit number";
      isValid = false;
    }

    if (!newCompanyValues.remark.trim()) {
      newErrors.remark = true;
      newHelperTexts.remark = "remark field is required";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      setHelperTexts(newHelperTexts);
      return;
    }



    console.log(newCompanyValues);
    try {
      const response = await axios.post(
        "http://ec2-52-66-67-174.ap-south-1.compute.amazonaws.com:3107/user/add-store",

        newCompanyValues, // Only send the code

        {
          headers: {
            token: token,
          },
        }
      );
      console.log("save:", response);
      console.log("Save response:", response.data.message);


      fetchData(); // Refetch data after successful save



      setSearchValue("")


      if (response.data.message) {
        toast.success(response.data.message, {
          position: "top-right",
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error saving record:", error);
    }


    handleCloseDialog();
  };



  const addcompanyhandle = (e) => {
    const { name, value } = e.target;
    setNewCompanyValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (value.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: true,
      }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        [name]: `${name} field is required`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: false,
      }));
      setHelperTexts((prevHelperTexts) => ({
        ...prevHelperTexts,
        [name]: '',
      }));
    }
  };

  const frequencyOptions = [

    // { label: "Select Frequency", value: "" },
    { label: "Low", value: "0" },
    { label: "Medium", value: "1" },
    { label: "High", value: "2" },

  ];

  const frequencyOptionsEdite = [

    { label: "Low", value: "0" },
    { label: "Medium", value: "1" },
    { label: "High", value: "2" },

  ];

  // edit company

  const [openDialogedit, setOpenDialogedit] = useState(false);

  const [editCompanyValues, editNewCompanyValues] = useState({});

  const handleOpenDialogedit = (row) => {

    editNewCompanyValues({

      _id: row._id,
      code: row.Code,
      name: row.Name,
      machines: row.Machines,
      link: row.Link,
      frequency: row.Frequency,
      contact_no: row.Contact_Number,
      remark: row.Remark,
      area: row.Area

    });
    console.log(row);
    setOpenDialogedit(true);
  };

  const handleCloseDialogedit = () => {
    setOpenDialogedit(false);
    setEditCompanyErrors({});
  };



  const editcompanyhandle = (e) => {
    const { name, value } = e.target;
    editNewCompanyValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (value.trim() === '') {
      setEditCompanyErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name} field is required`,
      }));
    } else {
      setEditCompanyErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };




  const [editCompanyErrors, setEditCompanyErrors] = useState({});

  const handleedit = async () => {

    console.warn(editCompanyErrors)

    const errors = {};

    if (!editCompanyValues.code || !editCompanyValues.code.trim()) {
      errors.code = "code is required";
    }

    if (!editCompanyValues.name || !editCompanyValues.name.trim()) {
      errors.name = "name is required";
    }

    if (!editCompanyValues.link || !editCompanyValues.link.trim()) {
      errors.link = "link is required";
    }

    if (!editCompanyValues.machines || !editCompanyValues.machines.trim()) {
      errors.machines = "machines is required";
    }

    if (!editCompanyValues.area || !editCompanyValues.area.trim()) {
      errors.area = "area is required";
    }

    // if (!editCompanyValues.frequency) {
    //   errors.frequency = "Frequency is required";
    // }


    if (!editCompanyValues.contact_no || !editCompanyValues.contact_no.trim()) {
      errors.contact_no = "contact Number is required";
    } else if (
      !/^\d{10}$/g.test(editCompanyValues.contact_no) // Regex to validate 10-digit contact number
    ) {
      errors.contact_no = "invalid contact number format";
    }


    if (!editCompanyValues.remark || !editCompanyValues.remark.trim()) {
      errors.remark = "remark is required";
    }


    setEditCompanyErrors(errors);


    const id = editCompanyValues._id;

    if (Object.keys(errors).length === 0) {
      // Perform the edit operation
      // ...

      console.log(editCompanyValues.frequency)

      try {

        const response = await axios.patch(
          `http://ec2-52-66-67-174.ap-south-1.compute.amazonaws.com:3107/user/edit-store/${id}`,

          editCompanyValues,
          {
            headers: {
              token: token,
            },
          }
        );




        // console.log("Update response:", response.data.message);
        fetchData(); // Refetch data after successful update




        setSearchValue("")

        if (response.data.message) {
          toast.success(response.data.message, {
            position: "top-right",
            theme: "light",
          });
        }
      } catch (error) {
        console.error("Error updating record:", error);
      }

      handleCloseDialogedit();
    };
  }

  // search
  const [searchValue, setSearchValue] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [dataFound, setDataFound] = useState(true);


  useEffect(() => {
    setFilteredRows(rows); // Set initial filtered rows to show all records
  }, [rows]);





  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (value === "") {
      setFilteredRows(rows);
      setDataFound(true); // Show all records when search value is empty
    } else {
      setIsLoadingSearch(true); // Set loading state to true

      // Simulate an asynchronous search operation
      setTimeout(() => {
        const filtered = rows.filter((row) => {
          // Implement your search logic here
          // Return true if any column in the row matches the search value
          // Otherwise, return false
          return Object.values(row).some((columnValue) =>
            String(columnValue).toUpperCase().includes(value.toUpperCase())
          );
        });

        setFilteredRows(filtered);
        setDataFound(filtered.length > 0);
        setIsLoadingSearch(false); // Set loading state to false after search is complete
      }, 1000); // Adjust the timeout value as needed
    }
  };




  // delete rows
  const selectedRowsCount = selectedRows.length;



  const [openConfirmation, setOpenConfirmation] = useState(false);



  const handleOpenConfirmation = () => {


    setOpenConfirmation(true);


  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };


  const handleDeleteRows = async () => {
    // Close the confirmation dialog
    handleCloseConfirmation();

    // Extract the _id values from the selected rows
    const selectedIds = selectedRows.map((row) => row._id);

    try {
      // Make an API call to remove the companies
      const response = await axios.post(
        'http://ec2-52-66-67-174.ap-south-1.compute.amazonaws.com:3107/user/remove-company',
        {
          ids: selectedIds,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      console.warn(response.data.message);

      setSelectedRows([]);

      fetchData();
      if (
        response.data.message ===
        " you dont have permission to perform this.. !!"
      ) {
        toast.error(response.data.message, {
          position: "top-right",
          theme: "light",
        });
      }


    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };



  return (
    <>


      {loading ? (

        // show loading icon

        <Box className="table_loading"

        >
          <CircularProgress />
        </Box>
      ) : (

        // main all table
        <Box className="main_table_box"

        >
          <Paper
            className="table_pepar"

          >
            {/* table toolbar search */}
            <Toolbar>
              <Box className="table_header_box"

              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="h5"
                    component="div"

                    className="table_header_tital"

                  >
                    {Company.company}
                  </Typography>

                  <InputBase
                    placeholder="Search..."
                    inputProps={{ "aria-label": "search" }}
                    className="table_header_search"


                    value={searchValue}
                    onChange={handleSearch}

                    startAdornment={
                      <IconButton
                        sx={{ color: "#999" }}
                      >
                        <SearchIcon className="table_header_search_icon" />
                      </IconButton>
                    }
                  />


                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>



                  <Box>
                    {selectedRowsCount > 0 && filteredRows.length > 0 ? (
                      <Button
                        variant="contained"
                        color="error"
                        className="table_header_delete_button"
                        onClick={handleOpenConfirmation}
                        startIcon={<DeleteIcon />}
                      >
                        Delete ({selectedRowsCount})
                      </Button>
                    ) : null}
                  </Box>




                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenDialog}
                      className="table_header_button"

                      startIcon={<AddIcon />}
                    >
                      {Company.addCompany}
                    </Button>
                  </Box>
                </Box>

              </Box>
            </Toolbar>


            {isLoadingSearch ? (
              <Box className="table_loading">
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer className="TableContainer">
                <TableContainer className="TableContainer">
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow className="table_row">
                        <TableCell className="TableCell_Check" padding="checkbox">
                          <Checkbox
                            checked={selectedRows.length === rows.length}
                            indeterminate={
                              selectedRows.length > 0 && selectedRows.length < rows.length
                            }
                            onChange={(event) =>
                              event.target.checked ? setSelectedRows(rows) : setSelectedRows([])
                            }
                            disabled={filteredRows.length === 0}
                          />
                        </TableCell>

                        {columns.map((column) => {
                          if (column.id !== "checkbox") {
                            return (
                              <TableCell
                                className="TableCell_heading"
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </TableCell>
                            );
                          }
                          return null;
                        })}
                      </TableRow>
                    </TableHead>


                    {isLoadingSearch ? (
                      <Box className="table_loading">
                        <CircularProgress />
                      </Box>
                    ) : (

                      <TableBody>
                        {filteredRows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={columns.length + 1}>
                              <Alert severity="info">Oops !result not found</Alert>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                              const isRowSelected = selectedRows.indexOf(row) !== -1;

                              return (
                                <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                                  <TableCell className="company_table_row_hight" padding="checkbox">
                                    <Checkbox
                                      checked={isRowSelected}
                                      onChange={(event) => handleRowSelect(event, row)}
                                    />
                                  </TableCell>
                                  {columns.map((column) => {
                                    if (column.id === "action") {
                                      return (
                                        <TableCell
                                          className="company_table_row_hight"
                                          key={column.id}
                                        >
                                          <IconButton
                                            className="table_edite_icon"
                                            onClick={() => handleOpenDialogedit(row)}
                                          >
                                            <EditIcon />
                                          </IconButton>
                                          <IconButton
                                            color="error"
                                            onClick={() => deleteRecord(row._id)}
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </TableCell>
                                      );
                                    }

                                    if (column.id !== "checkbox") {
                                      const value = row[column.id];
                                      return (
                                        <TableCell
                                          className="company_table_row_hight"
                                          key={column.id}
                                          align={column.align}
                                        >
                                          {column.format && typeof value === "number"
                                            ? column.format(value)
                                            : value}
                                        </TableCell>
                                      );
                                    }
                                    return null;
                                  })}

                                </TableRow>
                              );
                            })
                        )}
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </TableContainer>
            )}



          </Paper>

          {/* TablePagination */}

          <Box className="table_Pagination" >

            <TablePagination


              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}

            />
          </Box>

        </Box>
      )}

      {/* add company modal */}
      <Modal
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal_box">
          <Typography
            className="Add_Company_modal_tital"


            variant="h5" component="h5">
            {Company.addCompany}
          </Typography>
          <Grid container spacing={2}>


            <Grid item xs={6}>
              <Typography className="modal_lable" variant="h6" component="h6"  >
                {Company.code}
              </Typography>
              <TextField
                name="code"
                fullWidth
                margin="normal"
                value={newCompanyValues.code}
                onChange={addcompanyhandle}
                placeholder="Enter Code"

                error={errors.code}
                // helperText={helperTexts.code}
                helperText={
                  errors.code && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {helperTexts.code}
                    </>
                  )
                }
                className="modal_input"

              />

              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.name}
              </Typography>
              <TextField
                name="name"
                fullWidth
                margin="normal"
                value={newCompanyValues.name}
                onChange={addcompanyhandle}
                placeholder="Enter Name"
                error={errors.name}
                // helperText={helperTexts.name}
                helperText={
                  errors.name && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {helperTexts.name}
                    </>
                  )
                }
                className="modal_input"
              />

              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.machines}
              </Typography>
              <TextField
                name="machines"
                fullWidth
                margin="normal"
                value={newCompanyValues.machines}
                onChange={addcompanyhandle}
                placeholder="Enter machine"
                error={errors.machines}
                // helperText={helperTexts.machines}
                helperText={
                  errors.machines && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {helperTexts.machines}
                    </>
                  )
                }
                className="modal_input"
              />

              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.area}
              </Typography>
              <TextField
                name="area"
                fullWidth
                margin="normal"
                value={newCompanyValues.area}
                onChange={addcompanyhandle}
                placeholder="Enter area "
                error={errors.area}
                // helperText={helperTexts.area}
                helperText={
                  errors.area && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {helperTexts.area}
                    </>
                  )
                }
                className="modal_input"
              />
            </Grid>

            <Grid item xs={6}>
              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.link}
              </Typography>
              <TextField
                name="link"
                fullWidth
                margin="normal"
                value={newCompanyValues.link}
                onChange={addcompanyhandle}
                placeholder="Enter Name"
                required
                error={errors.link}
                // helperText={helperTexts.link}
                helperText={
                  errors.link && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {helperTexts.link}
                    </>
                  )
                }
                className="modal_input"
              />


              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.frequency}
              </Typography>




              <TextField
                name="frequency"
                select
                fullWidth
                margin="normal"
                value={newCompanyValues.frequency}
                onChange={addcompanyhandle}
                className="modal_input"
                error={errors.frequency}
                helperText={
                  errors.frequency && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {helperTexts.frequency}
                    </>
                  )
                }
                SelectProps={{
                  displayEmpty: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  placeholder: 'Select frequency',
                }}
              >
                <MenuItem disabled value="">
                  Select frequency
                </MenuItem>
                {frequencyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>


              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.contact_no}
              </Typography>
              <TextField
                name="contact_no"
                fullWidth
                margin="normal"
                value={newCompanyValues.contact_no}
                onChange={addcompanyhandle}
                placeholder="Enter Contact Number"
                required
                error={errors.contact_no}
                // helperText={helperTexts.contact_no}
                helperText={
                  errors.contact_no && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {helperTexts.contact_no}
                    </>
                  )
                }
                className="modal_input"
              />

              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.remark}
              </Typography>
              <TextField
                name="remark"
                fullWidth
                margin="normal"
                value={newCompanyValues.remark}
                onChange={addcompanyhandle}
                placeholder="Enter remark here"
                required
                error={errors.remark}
                // helperText={helperTexts.remark}
                helperText={
                  errors.remark && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {helperTexts.remark}
                    </>
                  )
                }
                className="modal_input"
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              color="primary"
              className="Add_Company_modal_cancel"

            >
              {Company.cancelButton}
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary"
              className="Add_Company_modal_Save"

            >
              {Company.saveButton}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* edit modal */}
      <Modal
        open={openDialogedit}
        onClose={handleCloseDialogedit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="edite_company"
      >
        <Box sx={style}>
          <Typography
            className="edit_Company_modal_tital"


            variant="h5" component="h5">
            {Company.editCompany}
          </Typography>
          <Grid container spacing={2} >
            <Grid item xs={6}>
              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.code}
              </Typography>
              <TextField

                placeholder="Enter Code"

                className="modal_input"
                error={Boolean(editCompanyErrors.code)}
                helperText={
                  editCompanyErrors.code && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {editCompanyErrors.code}
                    </>
                  )
                }

                value={editCompanyValues.code}
                onChange={editcompanyhandle}
                name="code"
                fullWidth
                margin="normal"

              />

              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.name}
              </Typography>
              <TextField

                placeholder="Enter Name"
                className="modal_input"
                error={Boolean(editCompanyErrors.name)}
                // helperText={editCompanyErrors.name}

                helperText={
                  editCompanyErrors.name && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {editCompanyErrors.name}
                    </>
                  )
                }

                value={editCompanyValues.name}
                onChange={editcompanyhandle}

                name="name"
                fullWidth
                margin="normal"

              />

              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.link}
              </Typography>
              <TextField
                placeholder="Enter Link"
                className="modal_input"
                error={Boolean(editCompanyErrors.link)}
                // helperText={editCompanyErrors.link}
                helperText={
                  editCompanyErrors.link && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {editCompanyErrors.link}
                    </>
                  )
                }

                value={editCompanyValues.link}
                onChange={editcompanyhandle}

                name="link"
                fullWidth
                margin="normal"

              />

              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.machines}

              </Typography>
              <TextField
                placeholder="Enter Machines"
                className="modal_input"
                error={Boolean(editCompanyErrors.machines)}
                // helperText={editCompanyErrors.machines}
                helperText={
                  editCompanyErrors.machines && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {editCompanyErrors.machines}
                    </>
                  )
                }

                value={editCompanyValues.machines}
                onChange={editcompanyhandle}
                name="machines"
                fullWidth
                margin="normal"
              />
            </Grid>



            <Grid item xs={6}>

              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.area}

              </Typography>
              <TextField

                className="modal_input"
                name="area"
                fullWidth
                margin="normal"
                value={editCompanyValues.area}
                onChange={editcompanyhandle}
                placeholder="Enter Area "
                error={Boolean(editCompanyErrors.area)}
                // helperText={editCompanyErrors.area}
                helperText={
                  editCompanyErrors.area && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {editCompanyErrors.area}
                    </>
                  )
                }
              />

              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.frequency}
              </Typography>



              <TextField
                placeholder="Enter Frequency"
                className="modal_input"
                error={Boolean(editCompanyErrors.frequency)}
                // helperText={editCompanyErrors.frequency}
                helperText={
                  editCompanyErrors.frequency && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {editCompanyErrors.frequency}
                    </>
                  )
                }
                name="frequency"
                select
                fullWidth
                margin="normal"

                value={editCompanyValues.frequency}

                onChange={editcompanyhandle}
                SelectProps={{
                  displayEmpty: true,
                }}
                InputLabelProps={{ shrink: true }}
              >

                {frequencyOptionsEdite.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>





              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.contact_no}
              </Typography>
              <TextField
                placeholder="Enter Contact Number"

                className="modal_input"
                error={Boolean(editCompanyErrors.contact_no)}
                // helperText={editCompanyErrors.contact_no}
                helperText={
                  editCompanyErrors.contact_no && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {editCompanyErrors.contact_no}
                    </>
                  )
                }
                value={editCompanyValues.contact_no}
                onChange={editcompanyhandle}
                name="contact_no"
                type=""
                fullWidth
                margin="normal"
              />

              <Typography className="modal_lable" variant="h6" component="h6">
                {Company.remark}
              </Typography>
              <TextField
                placeholder="Enter Remark"
                className="modal_input"
                error={Boolean(editCompanyErrors.remark)}
                // helperText={editCompanyErrors.remark}
                helperText={
                  editCompanyErrors.remark && (
                    <>
                      <ReportGmailerrorredIcon className="warning_icon" color="error" fontSize="small" />
                      {editCompanyErrors.remark}
                    </>
                  )
                }
                value={editCompanyValues.remark}
                onChange={editcompanyhandle}
                name="remark"
                fullWidth
                margin="normal"
              />

            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
            }}
          >
            <Button
              onClick={handleCloseDialogedit}
              variant="outlined"
              color="primary"
              className="edit_Company_modal_cancel"

            >
              {Company.cancelButton}
            </Button>
            <Button onClick={handleedit} variant="contained" color="primary"
              className="edit_Company_modal_Save"

            >
              {Company.editButton}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* show alert  */}

      <ToastContainer />

      {/* show pops in delte buttons */}

      <Dialog className="pops" open={openConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle className="pops_tital">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText className="pops_info">
            Are you sure you want to delete the selected {selectedRowsCount} rows
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" className="show_pops_cancel" onClick={handleCloseConfirmation}>Cancel</Button>
          <Button variant="contained" className="show_pops_yes" onClick={handleDeleteRows} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>




      

    </>



  );
}






