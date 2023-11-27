import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { useNavigate } from 'react-router-dom';
import SwitchButton from "../components/miscellaneous/SwitchButton";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import SortIcon from "../components/icons/SortIcon";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    size: 225,
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "email",
    header: "Email Id",
    size: 225,
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: SwitchButton,
    enableSorting: false,
  },
];

const UsersPage = () => {
  let toast = useToast();
  const [data, setData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect triggered");
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      setIsLoading(true);
      const { data: userData } = await axios.get(
        `http://localhost:3008/api/user/getAllUsers`,
        config
      );
      console.log(userData.users);
      // if(userData) {
      setData(userData.users);
      // }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error!",
        description: "Failed to Load the users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
  });

  return !isLoading ? (
    <>
      <IconButton
        marginLeft={10}
        marginTop={5}
        w={50}
        h={50}
        d={{ base: "flex", md: "none" }}
        icon={<ArrowBackIcon />}
        onClick={() => {navigate(-1)}}
      />
      <Box
        display="flex"
        flexDirection="row"
        mx="auto"
        justifyContent="Center"
        alignItems="Center"
      >
        <Box
          overflowY="scroll"
          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              width: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: "#b2b7b8",
              borderRadius: '24px',
            },
          }}
          maxH={600}
          bg="white"
          maxW={1000}
          mx="auto"
          px={6}
          pt={5}
          fontSize="sm"
          borderRadius={5}
        >
          <Heading
            position="sticky"
            borderRadius={5}
            color="white"
            bg="#23c4cc"
            pt={3}
            pb={3}
            textAlign="center"
            mb={10}
          >
            Users
          </Heading>
          <Table className="table" w={table.getTotalSize()}>
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr className="tr" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th className="th" w={header.getSize()} key={header.id}>
                      {header.column.columnDef.header}
                      {header.column.getCanSort() && (
                        <Icon
                          as={SortIcon}
                          mx={3}
                          fontSize={14}
                          onClick={header.column.getToggleSortingHandler()}
                        />
                      )}
                      {
                        {
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted()]
                      }
                      <Box
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`}
                      />
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr className="tr" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td className="td" w={cell.column.getSize()} key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
          <br />
          <Text mb={2}>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </Text>
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </>
  ) : (
    <Box
      w="100%"
      h="100vw"
      bgColor="white"
      opacity="60%"
      display="flex"
      flexDirection="row"
      mx="auto"
      justifyContent="Center"
      alignItems="Center"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Box>
  );
};
export default UsersPage;
