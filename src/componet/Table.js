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
  Box,
  Button,
  Checkbox,
  CircularProgress,
  DialogTitle,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Modal,
  Popover,
  Select,
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
    width: "900px",
    height: "700px",
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  const [errors, setErrors] = useState({});
  const [helperTexts, setHelperTexts] = useState({});

  const handleSave = async () => {



    setErrors({});
    setHelperTexts({});

    let isValid = true;
    const newErrors = {};
    const newHelperTexts = {};

    // Check for required fields
    if (!newCompanyValues.code) {
      newErrors.code = true;
      newHelperTexts.code = "code field is required";
      isValid = false;
    }

    if (!newCompanyValues.name) {
      newErrors.name = true;
      newHelperTexts.name = "name field is required";
      isValid = false;
    }

    if (!newCompanyValues.machines) {
      newErrors.machines = true;
      newHelperTexts.machines = "machines field is required";
      isValid = false;
    }

    if (!newCompanyValues.area) {
      newErrors.area = true;
      newHelperTexts.area = "area field is required";
      isValid = false;
    }

    if (!newCompanyValues.link) {
      newErrors.link = true;
      newHelperTexts.link = "link field is required";
      isValid = false;
    }

    if (!newCompanyValues.frequency) {
      newErrors.frequency = true;
      newHelperTexts.frequency = "frequency field is required";
      isValid = false;
    }

    if (!newCompanyValues.contact_no) {
      newErrors.contact_no = true;
      newHelperTexts.contact_no = "contact_no field is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(newCompanyValues.contact_no)) {
      newErrors.contact_no = true;
      newHelperTexts.contact_no = "Contact number must be a 10-digit number";
      isValid = false;
    }

    if (!newCompanyValues.remark) {
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
    setNewCompanyValues({
      ...newCompanyValues,
      [e.target.name]: e.target.value,
    });
  };

  const frequencyOptions = [

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
  };

  const editcompanyhandle = (e) => {
    editNewCompanyValues({
      ...editCompanyValues,
      [e.target.name]: e.target.value,
    });
  };

  const [editCompanyErrors, setEditCompanyErrors] = useState({});

  const handleedit = async () => {

    console.warn(editCompanyErrors)

    const errors = {};

    if (!editCompanyValues.code || !editCompanyValues.code.trim()) {
      errors.code = "Code is required";
    }

    if (!editCompanyValues.name || !editCompanyValues.name.trim()) {
      errors.name = "Name is required";
    }

    if (!editCompanyValues.link || !editCompanyValues.link.trim()) {
      errors.link = "Link is required";
    }

    if (!editCompanyValues.machines || !editCompanyValues.machines.trim()) {
      errors.machines = "Machines is required";
    }

    if (!editCompanyValues.frequency) {
      errors.frequency = "Frequency is required";
    }

    if (!editCompanyValues.contact_no || !editCompanyValues.contact_no.trim()) {
      errors.contact_no = "Contact Number is required";
    } else if (
      !/^\d{10}$/g.test(editCompanyValues.contact_no) // Regex to validate 10-digit contact number
    ) {
      errors.contact_no = "Invalid contact number format";
    }

    if (!editCompanyValues.remark || !editCompanyValues.remark.trim()) {
      errors.remark = "Remark is required";
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




  return (
    <>
      {loading ? (
        // show loading icon
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        // main all table
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            {/* table toolbar search */}
            <Toolbar>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ marginRight: "8px", fontWeight: "700" }}
                  >
                    Company
                  </Typography>
                  <InputBase
                    placeholder="Search..."
                    inputProps={{ "aria-label": "search" }}
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      height: "48px",
                      width: "400px",
                      left: "40px",
                    }}
                    startAdornment={
                      <IconButton sx={{ color: "#999" }}>
                        <SearchIcon />
                      </IconButton>
                    }
                  />
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                    sx={{
                      width: "220px",
                      height: "48px",
                      backgroundColor: "#00B3FF",
                    }}
                    startIcon={<AddIcon />}
                  >
                    Add Company
                  </Button>
                </Box>
              </Box>
            </Toolbar>

            {/* table */}
            <TableContainer style={{ maxHeight: '700px' }}>
              <Table stickyHeader aria-label="sticky table">
                {/* table header */}
                <TableHead>
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      sx={{ backgroundColor: "#f7f9fa" }}
                    >
                      <Checkbox
                        checked={selectedRows.length === rows.length}
                        indeterminate={
                          selectedRows.length > 0 &&
                          selectedRows.length < rows.length
                        }
                        onChange={(event) =>
                          event.target.checked
                            ? setSelectedRows(rows)
                            : setSelectedRows([])
                        }
                      />
                    </TableCell>
                    {columns.map((column) => {
                      if (column.id !== "checkbox") {
                        return (
                          <TableCell
                            sx={{
                              backgroundColor: "#f7f9fa",
                              fontWeight: "600",
                            }}
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

                {/* table body */}
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isRowSelected = selectedRows.indexOf(row) !== -1;

                      return (
                        <TableRow
                          key={index}
                          hover
                          role="checkbox"
                          tabIndex={-1}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isRowSelected}
                              onChange={(event) => handleRowSelect(event, row)}
                            />
                          </TableCell>
                          {columns.map((column) => {
                            if (column.id === "action") {
                              return (
                                <TableCell key={column.id}>
                                  <IconButton
                                    sx={{ color: "#00B3FF" }}
                                    onClick={() => handleOpenDialogedit(row)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() => deleteRecord(row._id)} // Call the deleteRecord function with the row's _id
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              );
                            }
                            if (column.id !== "checkbox") {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
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
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* TablePagination */}

          <Box mt={5} >

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
        <Box sx={style}>
          <Typography sx={{
            fontWeight: "700", width: "194px",
            height: "28px", marginBottom: "25px"
          }} variant="h5" component="h5">
            Add Company
          </Typography>
          <Grid container spacing={2}>


            <Grid item xs={6}>
              <Typography className="email_lable" variant="h6" component="h6"  >
                Code
              </Typography>
              <TextField
                name="code"
                fullWidth
                margin="normal"
                value={newCompanyValues.code}
                onChange={addcompanyhandle}
                placeholder="Enter Code"

                error={errors.code}
                helperText={helperTexts.code}


              />

              <Typography className="email_lable" variant="h6" component="h6">
                name
              </Typography>
              <TextField
                name="name"
                fullWidth
                margin="normal"
                value={newCompanyValues.name}
                onChange={addcompanyhandle}
                placeholder="Enter Name"
                error={errors.name}
                helperText={helperTexts.name}
              />

              <Typography className="email_lable" variant="h6" component="h6">
                machines
              </Typography>
              <TextField
                name="machines"
                fullWidth
                margin="normal"
                value={newCompanyValues.machines}
                onChange={addcompanyhandle}
                placeholder="Enter machine"
                error={errors.machines}
                helperText={helperTexts.machines}
              />

              <Typography className="email_lable" variant="h6" component="h6">
                area
              </Typography>
              <TextField
                name="area"
                fullWidth
                margin="normal"
                value={newCompanyValues.area}
                onChange={addcompanyhandle}
                placeholder="Enter area "
                error={errors.area}
                helperText={helperTexts.area}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography className="email_lable" variant="h6" component="h6">
                Add link
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
                helperText={helperTexts.link}
              />




              <Typography className="email_lable" variant="h6" component="h6">
                frequency
              </Typography>


              <TextField
                name="frequency"
                select
                fullWidth
                margin="normal"
                value={newCompanyValues.frequency}
                onChange={addcompanyhandle}

                error={errors.frequency}
                helperText={helperTexts.frequency}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value) => (value ? value : "Select Frequency"),
                }}
                InputLabelProps={{ shrink: true }}
                placeholder="Select Frequency" // Placeholder text
              >



                {frequencyOptions.map((option) => {

                  return (

                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>

                  )
                })}

              </TextField>


              <Typography className="email_lable" variant="h6" component="h6">
                contact_no
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
                helperText={helperTexts.contact_no}
              />

              <Typography className="email_lable" variant="h6" component="h6">
                remark
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
                helperText={helperTexts.remark}
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
              sx={{ marginRight: "24px", width: "147px", height: "48px", color: "#34485C", borderColor: "#34485C" }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary"
              sx={{
                width: "147px", height: "48px", background:
                  "#00B3FF"
              }}
            >
              Save
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
      >
        <Box sx={style}>
          <Typography sx={{
            fontWeight: "700", width: "194px",
            height: "28px", marginBottom: "25px"
          }} variant="h5" component="h5">
            Edite Company
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography className="email_lable" variant="h6" component="h6">
                Code
              </Typography>
              <TextField



                error={Boolean(editCompanyErrors.code)}
                helperText={editCompanyErrors.code}

                value={editCompanyValues.code}
                onChange={editcompanyhandle}
                name="code"
                fullWidth
                margin="normal"

              />

              <Typography className="email_lable" variant="h6" component="h6">
                name
              </Typography>
              <TextField

                error={Boolean(editCompanyErrors.name)}
                helperText={editCompanyErrors.name}

                value={editCompanyValues.name}
                onChange={editcompanyhandle}
                name="name"
                fullWidth
                margin="normal"

              />

              <Typography className="email_lable" variant="h6" component="h6">
                Link
              </Typography>
              <TextField


                error={Boolean(editCompanyErrors.link)}
                helperText={editCompanyErrors.link}
                value={editCompanyValues.link}
                onChange={editcompanyhandle}
                name="machines"
                fullWidth
                margin="normal"
              />

              <Typography className="email_lable" variant="h6" component="h6">
                Machines
              </Typography>
              <TextField

                error={Boolean(editCompanyErrors.machines)}
                helperText={editCompanyErrors.machines}

                value={editCompanyValues.machines}
                onChange={editcompanyhandle}
                name="machines"
                fullWidth
                margin="normal"
              />
            </Grid>



            <Grid item xs={6}>

              <Typography className="email_lable" variant="h6" component="h6">
                area
              </Typography>
              <TextField
                name="area"
                fullWidth
                margin="normal"
                value={editCompanyValues.area}
                onChange={editcompanyhandle}
                placeholder="Enter area "
                error={errors.area}
                helperText={helperTexts.area}
              />

              <Typography className="email_lable" variant="h6" component="h6">
                Frequency
              </Typography>


              {/* <TextField
                  error={Boolean(editCompanyErrors.frequency)}
                  helperText={editCompanyErrors.frequency}
                name="frequency"
                select
                fullWidth
                margin="normal"
                value={editCompanyValues.frequency}
                onChange={editcompanyhandle}

                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value) => (value ? value : "Select Frequency"),
                }}
                InputLabelProps={{ shrink: true }}
             
              >



                {frequencyOptions.map((option) => {

                  return (

                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>

                  )
                })}

              </TextField> */}


              <TextField
                error={Boolean(editCompanyErrors.frequency)}
                helperText={editCompanyErrors.frequency}
                name="frequency"
                select
                fullWidth
                margin="normal"
                value={editCompanyValues.frequency}
                onChange={editcompanyhandle}
                SelectProps={{

                  displayEmpty: true,

                  renderValue: (value) => {

                    return value;
                  }
                }}
                InputLabelProps={{ shrink: true }}
              >
                {frequencyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>



              <Typography className="email_lable" variant="h6" component="h6">
                Contact_Number
              </Typography>
              <TextField

                error={Boolean(editCompanyErrors.contact_no)}
                helperText={editCompanyErrors.contact_no}
                value={editCompanyValues.contact_no}
                onChange={editcompanyhandle}
                name="contact_no"
                type=""
                fullWidth
                margin="normal"
              />

              <Typography className="email_lable" variant="h6" component="h6">
                remark
              </Typography>
              <TextField

                error={Boolean(editCompanyErrors.remark)}
                helperText={editCompanyErrors.remark}
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
              sx={{ marginRight: "24px", width: "147px", height: "48px", color: "#34485C", borderColor: "#34485C" }}
            >
              Cancel
            </Button>
            <Button onClick={handleedit} variant="contained" color="primary" sx={{
              width: "147px", height: "48px", background:
                "#00B3FF"
            }}>
              edit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* show alert  */}
      <ToastContainer />

    </>



  );
}


