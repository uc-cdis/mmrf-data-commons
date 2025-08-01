import React, { useContext } from "react";
import { Grid, Text } from "@mantine/core";
import { PlayIcon } from "src/commonIcons";
import { AppContext } from "./context";
import { AppRegistrationEntry } from "./types";

export interface CoreToolCardProps {
  entry: AppRegistrationEntry;
}

const CoreToolCard: React.FC<CoreToolCardProps> = ({
  entry,
}: CoreToolCardProps) => {
  const { Link } = useContext(AppContext);

  return (
    <Link
      href={{
        pathname: "/analysis_page",
        query: {
          app: entry.id,
        },
      }}
      className="group"
    >
      <Grid
        classNames={{
          root: "h-full",
          inner:
            "border-secondary-darkest border h-full w-full m-0 rounded-md p-0",
        }}
      >
        <Grid.Col span={2} className="self-center">
          {entry.icon}
        </Grid.Col>
        <Grid.Col span={8} className="text-base-content-darkest">
          <Text size="sm" className="font-heading font-bold">
            {entry.name}
          </Text>
          <Text size="xs" className="font-content leading-5">
            {entry.description}
          </Text>
        </Grid.Col>
        <Grid.Col span={2} className="flex justify-end p-0 m-0">
          <div className="bg-secondary w-12 h-full p-0 group-hover:bg-secondary-darker group-focus:bg-secondary-darker rounded-none rounded-r flex justify-center items-center">
            <PlayIcon size={30} color="white" />
          </div>
        </Grid.Col>
      </Grid>
    </Link>
  );
};

export default CoreToolCard;
