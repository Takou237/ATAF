import type { ComponentType } from 'react';
import { AgenciesDirectory, AgencyForm, AgencyVerify } from './AgencyWidgets';
import {
  DocumentsList,
  DocumentsTable,
  EventsList,
  MediaGallery,
  NewsList,
  PublicationsList,
  RegulationsList,
  RegulationsNotes,
} from './ContentWidgets';
import { MembersDirectory, MembershipForm, MembersTable, PartnersGrid } from './MembersWidgets';
import type { WidgetProps } from './types';

/**
 * Blocs dynamiques : la clé est stockée dans `pages.sections[].widget`
 * et doit rester identique à `PageForm::WIDGETS` côté Laravel.
 */
export const WIDGETS: Record<string, ComponentType<WidgetProps>> = {
  members_directory: MembersDirectory,
  members_table: MembersTable,
  partners_grid: PartnersGrid,
  membership_form: MembershipForm,
  agencies_directory: AgenciesDirectory,
  agency_verify: AgencyVerify,
  agency_form: AgencyForm,
  documents_list: DocumentsList,
  publications_list: PublicationsList,
  media_gallery: MediaGallery,
  news_list: NewsList,
  events_list: EventsList,
  regulations_list: RegulationsList,
  documents_table: DocumentsTable,
  regulations_notes: RegulationsNotes,
};
