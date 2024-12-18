import React from "react";
import {
  Collapse,
  Button,
  Card,
  Typography,
  CardBody,
} from "@material-tailwind/react";
import PropTypes from "prop-types";

export function CollapseComponent({ name, content }) {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = () => setOpen((cur) => !cur);

  return (
    <React.Fragment>
      <Button onClick={toggleOpen}>
        {open ? "Hide" : "Show"} {name}
      </Button>
      <Collapse open={open}>
        <Card className="my-4 mx-auto w-8/12">
          <CardBody>
            <Typography>{content}</Typography>
          </CardBody>
        </Card>
      </Collapse>
    </React.Fragment>
  );
}
export default CollapseComponent;
