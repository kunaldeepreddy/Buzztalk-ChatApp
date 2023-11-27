import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { ChatState } from "../../Context/ChatProvider";
import Switch from "react-switch";
const SwitchButton = ({ getValue, row, column, table }) => {
  const status = getValue();
  let toast = useToast();
  const [statusValue, setStatusValue] = useState([]);

  useEffect(() => {
    setStatusValue(status);
  }, [status]);

  const ChangeStatus = async (value) => {
    try {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:3008/api/user/activateOrDeactivateUser",
        {
          email: row.original.email,
          isActive: value,
        },
        config
      );
      console.log(data);
      setStatusValue(value);
      if (data.status) {
        table.options.meta?.updateData(row.index, column.id, value);
        toast({
          title: `user ${value ? "enabled" : "disabled"} successfully`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
      else {
        toast({
            title: `user ${value ? "enabled" : "disabled"} already`,
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
      }
      console.log(statusValue);
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to edit user Status",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    // <Input
    //   value={value}
    //   onChange={(e) => setValue(e.target.value)}
    //   onBlur={onBlur}
    //   variant="filled"
    //   size="sm"
    //   w="85%"
    //   overflow="hidden"
    //   textOverflow="ellipsis"
    //   whiteSpace="nowrap"
    // />
    <Switch onChange={ChangeStatus} checked={statusValue} />
  );
};
export default SwitchButton;
