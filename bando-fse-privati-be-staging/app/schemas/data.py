
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, date


class DashboardStatsOut(BaseModel):
    total_strutture: int
    compilazioni_per_tipologia_documentale: dict[str, int]
    totale_fondi: int
    residuo_fondi: int
    costo_totale_strutture: int
    fondi_totali_da_erogare_stato_1: int
    fondi_totali_da_erogare_stato_2: int
    fondi_totali_da_erogare_stato_4: int
    fondi_totali_da_erogare_stato_5: int
    totale_righe_stato_4: int
    totale_righe_stato_5: int
    totale_richieste_fuori_bando: int
    software_unici_per_profilo_documentale_stato_1: dict[str, dict[str, object]]
    software_unici_per_profilo_documentale_stato_2: dict[str, dict[str, object]]
    software_unici_per_profilo_documentale_stato_3: dict[str, dict[str, object]]
    software_unici_per_profilo_documentale_stato_4: dict[str, dict[str, object]]
    software_unici_per_profilo_documentale_stato_5: dict[str, dict[str, object]]
    partite_iva_stato_4: list[str]
    partite_iva_stato_5: list[str]



# --- Create: solo i campi obbligatori di anagrafica ---
class ItemCreate(BaseModel):
    # Anagrafica Rappresentante
    Rappresentante_nomeRapp: str
    Rappresentante_cognomeRapp: str
    Rappresentante_PEC: str
    # Anagrafica Struttura
    Anagrafica_denominazione: str
    Anagrafica_partitaIva: str
    Anagrafica_tipoSoggetto: str
    Anagrafica_provincia: str
    Anagrafica_comune: str
    Anagrafica_indirizzo: str
    Anagrafica_cap: str | None = None
    Anagrafica_telefonoRapp: str
    Anagrafica_email: str
    Anagrafica_accreditamento: bool
    Anagrafica_convenzioneSSR: bool
    Anagrafica_convenzioneASL: bool | None = None
    Anagrafica_numeroSedi: int | None = None

class ItemUpdate(BaseModel):
    Rappresentante_nomeRapp: str | None = None
    Rappresentante_cognomeRapp: str | None = None
    Rappresentante_PEC: str | None = None

    Anagrafica_denominazione: str | None = None
    Anagrafica_partitaIva: str | None = None
    Anagrafica_tipoSoggetto: str | None = None
    Anagrafica_provincia: str | None = None
    Anagrafica_comune: str | None = None
    Anagrafica_indirizzo: str | None = None
    Anagrafica_cap: str | None = None
    Anagrafica_telefonoRapp: str | None = None
    Anagrafica_email: str | None = None
    Anagrafica_accreditamento: bool | None = None
    Anagrafica_convenzioneSSR: bool | None = None
    Anagrafica_convenzioneASL: bool | None = None
    Anagrafica_numeroSedi: int | None = None

    # --- Altre informazioni ---
    AltreInformazioni_ambitiPrestazioni_0: str | None = None
    AltreInformazioni_ambitiPrestazioni_1: str | None = None
    AltreInformazioni_finanziamentoPNRR: bool | None = None
    AltreInformazioni_conservazioneDigitale: bool | None = None
    IstanzaEconomica_contributoRichiesto: int | None = None
    repository_proprietario: str | None = None
    endpoint: str | None = None
    endpoint_start_date_end_date: str | None = None
    stato_monitoraggio: int | None = None

    # --- LDO ---
    LDO_LDO: bool | None = None
    LDO_LDOdigitale: bool | None = None
    LDO_LDOdigitale_TDTLDO: bool | None = None
    LDO_LDOdigitale_applicativoLDO: str | None = None
    LDO_LDOdigitale_fornitoreApplicativoLDO: str | None = None
    LDO_LDOdigitale_versioneApplicativoLDO: str | None = None
    LDO_LDOdigitale_PDFfirmatiLDO: bool | None = None
    LDO_CN_Certificato: str | None = None
    LDO_richiesta_adesione: date | None = None
    LDO_ticket_cart: str | None = None
    LDO_referente_adesione: str | None = None
    LDO_referente_tecnico_applicativo: str | None = None
    LDO_test_validate_create: bool | None = None
    LDO_test_sostituzione: bool | None = None
    LDO_test_aggiornamento: bool | None = None
    LDO_test_eliminazione: bool | None = None
    LDO_data_richiesta_certificato: date | None = None
    LDO_data_emissione_certificato: date | None = None
    LDO_autorizzazione_prod: bool | None = None
    LDO_data_invio_certificati_ente_adesione: date | None = None
    LDO_data_accreditamento: date | None = None
    LDO_data_autorizzazione_prod: date | None = None
    LDO_psw_certificato_raki: str | None = None

    # --- LAB ---
    LAB_LAB: bool | None = None
    LAB_LABdigitale: bool | None = None
    LAB_LABdigitale_TDTLAB: bool | None = None
    LAB_LABdigitale_applicativoLAB: str | None = None
    LAB_LABdigitale_fornitoreApplicativoLAB: str | None = None
    LAB_LABdigitale_versioneApplicativoLAB: str | None = None
    LAB_LABdigitale_PDFfirmatiLAB: bool | None = None
    LAB_CN_Certificato: str | None = None
    LAB_richiesta_adesione: date | None = None
    LAB_ticket_cart: str | None = None
    LAB_referente_adesione: str | None = None
    LAB_referente_tecnico_applicativo: str | None = None
    LAB_test_validate_create: bool | None = None
    LAB_test_sostituzione: bool | None = None
    LAB_test_aggiornamento: bool | None = None
    LAB_test_eliminazione: bool | None = None
    LAB_data_richiesta_certificato: date | None = None
    LAB_data_emissione_certificato: date | None = None
    LAB_autorizzazione_prod: bool | None = None
    LAB_data_invio_certificati_ente_adesione: date | None = None
    LAB_data_accreditamento: date | None = None
    LAB_data_autorizzazione_prod: date | None = None
    LAB_psw_certificato_raki: str | None = None

    # --- RAD ---
    RAD_RAD: bool | None = None
    RAD_RADdigitale: bool | None = None
    RAD_RADdigitale_TDTRAD: bool | None = None
    RAD_RADdigitale_applicativoRAD: str | None = None
    RAD_RADdigitale_fornitoreApplicativoRAD: str | None = None
    RAD_RADdigitale_versioneApplicativoRAD: str | None = None
    RAD_RADdigitale_PDFfirmatiRAD: bool | None = None
    RAD_CN_Certificato: str | None = None
    RAD_richiesta_adesione: date | None = None
    RAD_ticket_cart: str | None = None
    RAD_referente_adesione: str | None = None
    RAD_referente_tecnico_applicativo: str | None = None
    RAD_test_validate_create: bool | None = None
    RAD_test_sostituzione: bool | None = None
    RAD_test_aggiornamento: bool | None = None
    RAD_test_eliminazione: bool | None = None
    RAD_data_richiesta_certificato: date | None = None
    RAD_data_emissione_certificato: date | None = None
    RAD_autorizzazione_prod: bool | None = None
    RAD_data_invio_certificati_ente_adesione: date | None = None
    RAD_data_accreditamento: date | None = None
    RAD_data_autorizzazione_prod: date | None = None
    RAD_psw_certificato_raki: str | None = None

    # --- RSA ---
    RSA_RSA: bool | None = None
    RSA_RSAdigitale: bool | None = None
    RSA_RSAdigitale_TDTRSA: bool | None = None
    RSA_RSAdigitale_applicativoRSA: str | None = None
    RSA_RSAdigitale_fornitoreApplicativoRSA: str | None = None
    RSA_RSAdigitale_versioneApplicativoRSA: str | None = None
    RSA_RSAdigitale_PDFfirmatiRSA: bool | None = None
    RSA_CN_Certificato: str | None = None
    RSA_richiesta_adesione: date | None = None
    RSA_ticket_cart: str | None = None
    RSA_referente_adesione: str | None = None
    RSA_referente_tecnico_applicativo: str | None = None
    RSA_test_validate_create: bool | None = None
    RSA_test_sostituzione: bool | None = None
    RSA_test_aggiornamento: bool | None = None
    RSA_test_eliminazione: bool | None = None
    RSA_data_richiesta_certificato: date | None = None
    RSA_data_emissione_certificato: date | None = None
    RSA_autorizzazione_prod: bool | None = None
    RSA_data_invio_certificati_ente_adesione: date | None = None
    RSA_data_accreditamento: date | None = None
    RSA_data_autorizzazione_prod: date | None = None
    RSA_psw_certificato_raki: str | None = None

    # --- RAP ---
    RAP_RAP: bool | None = None
    RAP_RAPdigitale: bool | None = None
    RAP_RAPdigitale_TDTRAP: bool | None = None
    RAP_RAPdigitale_applicativoRAP: str | None = None
    RAP_RAPdigitale_fornitoreApplicativoRAP: str | None = None
    RAP_RAPdigitale_versioneApplicativoRAP: str | None = None
    RAP_RAPdigitale_PDFfirmatiRAP: bool | None = None
    RAP_CN_Certificato: str | None = None
    RAP_richiesta_adesione: date | None = None
    RAP_ticket_cart: str | None = None
    RAP_referente_adesione: str | None = None
    RAP_referente_tecnico_applicativo: str | None = None
    RAP_test_validate_create: bool | None = None
    RAP_test_sostituzione: bool | None = None
    RAP_test_aggiornamento: bool | None = None
    RAP_test_eliminazione: bool | None = None
    RAP_data_richiesta_certificato: date | None = None
    RAP_data_emissione_certificato: date | None = None
    RAP_autorizzazione_prod: bool | None = None
    RAP_data_invio_certificati_ente_adesione: date | None = None
    RAP_data_accreditamento: date | None = None
    RAP_data_autorizzazione_prod: date | None = None
    RAP_psw_certificato_raki: str | None = None

    # --- Check LDO/LAB/RAD/RSA/RPA ---
    LDO_fornitore_name_check: bool | None = None
    LDO_software_name_check: bool | None = None
    LDO_software_version_check: bool | None = None
    LAB_fornitore_name_check: bool | None = None
    LAB_software_name_check: bool | None = None
    LAB_software_version_check: bool | None = None
    RAD_fornitore_name_check: bool | None = None
    RAD_software_name_check: bool | None = None
    RAD_software_version_check: bool | None = None
    RSA_fornitore_name_check: bool | None = None
    RSA_software_name_check: bool | None = None
    RSA_software_version_check: bool | None = None
    RAP_fornitore_name_check: bool | None = None
    RAP_software_name_check: bool | None = None
    RAP_software_version_check: bool | None = None


# --- Output completo ---
class ItemOut(BaseModel):
    id: UUID

    Rappresentante_nomeRapp: str
    Rappresentante_cognomeRapp: str
    Rappresentante_PEC: str

    Anagrafica_denominazione: str
    Anagrafica_partitaIva: str
    Anagrafica_tipoSoggetto: str
    Anagrafica_provincia: str
    Anagrafica_comune: str
    Anagrafica_indirizzo: str
    Anagrafica_cap: str | None
    Anagrafica_telefonoRapp: str
    Anagrafica_email: str
    Anagrafica_accreditamento: bool
    Anagrafica_convenzioneSSR: bool
    Anagrafica_convenzioneASL: bool | None
    Anagrafica_numeroSedi: int | None

    AltreInformazioni_ambitiPrestazioni_0: str | None
    AltreInformazioni_ambitiPrestazioni_1: str | None
    AltreInformazioni_finanziamentoPNRR: bool | None
    AltreInformazioni_conservazioneDigitale: bool | None
    IstanzaEconomica_contributoRichiesto: int | None
    repository_proprietario: str | None
    endpoint: str | None
    endpoint_start_date_end_date: str | None
    stato_monitoraggio: int | None

    LDO_LDO: bool | None
    LDO_LDOdigitale: bool | None
    LDO_LDOdigitale_TDTLDO: bool | None
    LDO_LDOdigitale_applicativoLDO: str | None
    LDO_LDOdigitale_fornitoreApplicativoLDO: str | None
    LDO_LDOdigitale_versioneApplicativoLDO: str | None
    LDO_LDOdigitale_PDFfirmatiLDO: bool | None
    LDO_CN_Certificato: str | None
    LDO_richiesta_adesione: date | None
    LDO_ticket_cart: str | None
    LDO_referente_adesione: str | None
    LDO_referente_tecnico_applicativo: str | None
    LDO_test_validate_create: bool | None
    LDO_test_sostituzione: bool | None
    LDO_test_aggiornamento: bool | None
    LDO_test_eliminazione: bool | None
    LDO_data_richiesta_certificato: date | None
    LDO_data_emissione_certificato: date | None
    LDO_autorizzazione_prod: bool | None
    LDO_data_invio_certificati_ente_adesione: date | None
    LDO_data_accreditamento: date | None
    LDO_data_autorizzazione_prod: date | None
    LDO_psw_certificato_raki: str | None

    LAB_LAB: bool | None
    LAB_LABdigitale: bool | None
    LAB_LABdigitale_TDTLAB: bool | None
    LAB_LABdigitale_applicativoLAB: str | None
    LAB_LABdigitale_fornitoreApplicativoLAB: str | None
    LAB_LABdigitale_versioneApplicativoLAB: str | None
    LAB_LABdigitale_PDFfirmatiLAB: bool | None
    LAB_CN_Certificato: str | None
    LAB_richiesta_adesione: date | None
    LAB_ticket_cart: str | None
    LAB_referente_adesione: str | None
    LAB_referente_tecnico_applicativo: str | None
    LAB_test_validate_create: bool | None
    LAB_test_sostituzione: bool | None
    LAB_test_aggiornamento: bool | None
    LAB_test_eliminazione: bool | None
    LAB_data_richiesta_certificato: date | None
    LAB_data_emissione_certificato: date | None
    LAB_autorizzazione_prod: bool | None
    LAB_data_invio_certificati_ente_adesione: date | None
    LAB_data_accreditamento: date | None
    LAB_data_autorizzazione_prod: date | None
    LAB_psw_certificato_raki: str | None

    RAD_RAD: bool | None
    RAD_RADdigitale: bool | None
    RAD_RADdigitale_TDTRAD: bool | None
    RAD_RADdigitale_applicativoRAD: str | None
    RAD_RADdigitale_fornitoreApplicativoRAD: str | None
    RAD_RADdigitale_versioneApplicativoRAD: str | None
    RAD_RADdigitale_PDFfirmatiRAD: bool | None
    RAD_CN_Certificato: str | None
    RAD_richiesta_adesione: date | None
    RAD_ticket_cart: str | None
    RAD_referente_adesione: str | None
    RAD_referente_tecnico_applicativo: str | None
    RAD_test_validate_create: bool | None
    RAD_test_sostituzione: bool | None
    RAD_test_aggiornamento: bool | None
    RAD_test_eliminazione: bool | None
    RAD_data_richiesta_certificato: date | None
    RAD_data_emissione_certificato: date | None
    RAD_autorizzazione_prod: bool | None
    RAD_data_invio_certificati_ente_adesione: date | None
    RAD_data_accreditamento: date | None
    RAD_data_autorizzazione_prod: date | None
    RAD_psw_certificato_raki: str | None

    RSA_RSA: bool | None
    RSA_RSAdigitale: bool | None
    RSA_RSAdigitale_TDTRSA: bool | None
    RSA_RSAdigitale_applicativoRSA: str | None
    RSA_RSAdigitale_fornitoreApplicativoRSA: str | None
    RSA_RSAdigitale_versioneApplicativoRSA: str | None
    RSA_RSAdigitale_PDFfirmatiRSA: bool | None
    RSA_CN_Certificato: str | None
    RSA_richiesta_adesione: date | None
    RSA_ticket_cart: str | None
    RSA_referente_adesione: str | None
    RSA_referente_tecnico_applicativo: str | None
    RSA_test_validate_create: bool | None
    RSA_test_sostituzione: bool | None
    RSA_test_aggiornamento: bool | None
    RSA_test_eliminazione: bool | None
    RSA_data_richiesta_certificato: date | None
    RSA_data_emissione_certificato: date | None
    RSA_autorizzazione_prod: bool | None
    RSA_data_invio_certificati_ente_adesione: date | None
    RSA_data_accreditamento: date | None
    RSA_data_autorizzazione_prod: date | None
    RSA_psw_certificato_raki: str | None

    RAP_RAP: bool | None
    RAP_RAPdigitale: bool | None
    RAP_RAPdigitale_TDTRAP: bool | None
    RAP_RAPdigitale_applicativoRAP: str | None
    RAP_RAPdigitale_fornitoreApplicativoRAP: str | None
    RAP_RAPdigitale_versioneApplicativoRAP: str | None
    RAP_RAPdigitale_PDFfirmatiRAP: bool | None
    RAP_CN_Certificato: str | None
    RAP_richiesta_adesione: date | None
    RAP_ticket_cart: str | None
    RAP_referente_adesione: str | None
    RAP_referente_tecnico_applicativo: str | None
    RAP_test_validate_create: bool | None
    RAP_test_sostituzione: bool | None
    RAP_test_aggiornamento: bool | None
    RAP_test_eliminazione: bool | None
    RAP_data_richiesta_certificato: date | None
    RAP_data_emissione_certificato: date | None
    RAP_autorizzazione_prod: bool | None
    RAP_data_invio_certificati_ente_adesione: date | None
    RAP_data_accreditamento: date | None
    RAP_data_autorizzazione_prod: date | None
    RAP_psw_certificato_raki: str | None

    LDO_fornitore_name_check: bool | None
    LDO_software_name_check: bool | None
    LDO_software_version_check: bool | None
    LAB_fornitore_name_check: bool | None
    LAB_software_name_check: bool | None
    LAB_software_version_check: bool | None
    RAD_fornitore_name_check: bool | None
    RAD_software_name_check: bool | None
    RAD_software_version_check: bool | None
    RSA_fornitore_name_check: bool | None
    RSA_software_name_check: bool | None
    RSA_software_version_check: bool | None
    RAP_fornitore_name_check: bool | None
    RAP_software_name_check: bool | None
    RAP_software_version_check: bool | None

    created_at: datetime
    updated_at: datetime
