import { BaseContextModal } from "@/components/Modals/BaseModal";
import { FilterByUserInputModal } from "./FilterByUserInputModal";
import { SaveCohortModal } from "./SaveCohortModal";
import { AgreementModal } from '@/components/Modals/AgreementModal';
import { NoAccessModal } from '@/components/Modals/NoAccessModal';

export const mmrfModals = {
  baseContextModal: BaseContextModal,
  filterByUserInputModal: FilterByUserInputModal,
  saveCohortModal: SaveCohortModal,
  agreementModal: AgreementModal,
  noAccessModal: NoAccessModal,
};
