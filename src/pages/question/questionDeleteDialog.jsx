import { useCallback } from "react";
import { Typography } from "@material-tailwind/react";
import { useDeleteQuestion } from "./question.queries";
import { TrashIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

export const swalDefaultConfig = {
  title: "Bạn chắc chưa?",
  text: "Bạn sẽ không thể khôi phục được dữ liệu đã xóa!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Đồng ý",
  cancelButtonText: "Hủy",
};

export const DeleteDialog = ({ id }) => {
  const { mutate, isLoading: isDeleting } = useDeleteQuestion(id);
  const handleDeleteClick = useCallback((id) => {
    Swal.fire(swalDefaultConfig).then((status) => {
      if (status.isConfirmed) {
        mutate(id, {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Đã xóa!",
              text: "Dữ liệu đã được xóa.",
              showConfirmButton: false,
              timer: 1500,
            });
          },
          onError: () => {
            Swal.fire({
              icon: "error",
              title: "Dữ liệu chưa được xóa.",
              showConfirmButton: false,
              timer: 1500,
            });
          },
        });
      }
    });
  }, []);

  return (
    <Typography className="text-xs font-semibold text-red-600">
      <TrashIcon
        className="h-5 w-5 cursor-pointer"
        onClick={() => handleDeleteClick(id)}
      />
    </Typography>
  );
};
