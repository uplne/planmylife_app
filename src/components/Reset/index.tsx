import { Box } from "../Box";
import { H3 } from "../../components/Headlines/H3";
import { BasicButton } from "../../components/Buttons/BasicButton";

import { eraseAllData } from "../../containers/Settings/settings.controller";

export const Reset = () => {
  return (
    <Box className="w-1/2 bg-white shadow-[0px_0px_2px_0px_rgba(0,0,0,.15)] rounded">
      <H3 className="flex flex-row justify-center p-15 mb-0">Reset</H3>
      <div className="p-15 border-[rgb(229,231,235)] border-t-[1px] border-0 border-solid">
        <BasicButton primary className="w-full" onClick={eraseAllData}>
          Erase all data
        </BasicButton>
      </div>
    </Box>
  );
};
