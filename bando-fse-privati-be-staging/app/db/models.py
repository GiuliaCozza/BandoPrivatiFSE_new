
import uuid
from datetime import date, datetime

from sqlalchemy import String, Boolean, Integer, Date, text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PGUUID, TIMESTAMP

from app.db.session import Base


class Item(Base):
    __tablename__ = "items"

    id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # --- Anagrafica Rappresentante (obbligatori) ---
    Rappresentante_nomeRapp: Mapped[str] = mapped_column(String, nullable=False)
    Rappresentante_cognomeRapp: Mapped[str] = mapped_column(String, nullable=False)
    Rappresentante_PEC: Mapped[str] = mapped_column(String, nullable=False)

    # --- Anagrafica Struttura (obbligatori) ---
    Anagrafica_denominazione: Mapped[str] = mapped_column(String, nullable=False)
    Anagrafica_partitaIva: Mapped[str] = mapped_column(String, nullable=False)
    Anagrafica_tipoSoggetto: Mapped[str] = mapped_column(String, nullable=False)
    Anagrafica_provincia: Mapped[str] = mapped_column(String, nullable=False)
    Anagrafica_comune: Mapped[str] = mapped_column(String, nullable=False)
    Anagrafica_indirizzo: Mapped[str] = mapped_column(String, nullable=False)
    Anagrafica_cap: Mapped[str | None] = mapped_column(String, nullable=True)
    Anagrafica_telefonoRapp: Mapped[str] = mapped_column(String, nullable=False)
    Anagrafica_email: Mapped[str] = mapped_column(String, nullable=False)
    Anagrafica_accreditamento: Mapped[bool] = mapped_column(Boolean, nullable=False)
    Anagrafica_convenzioneSSR: Mapped[bool] = mapped_column(Boolean, nullable=False)
    Anagrafica_convenzioneASL: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    Anagrafica_numeroSedi: Mapped[int | None] = mapped_column(Integer, nullable=True)
    
    # --- Altre informazioni ---
    AltreInformazioni_ambitiPrestazioni_0: Mapped[str | None] = mapped_column(String, nullable=True)
    AltreInformazioni_ambitiPrestazioni_1: Mapped[str | None] = mapped_column(String, nullable=True)
    AltreInformazioni_finanziamentoPNRR: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    AltreInformazioni_conservazioneDigitale: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    IstanzaEconomica_contributoRichiesto: Mapped[int | None] = mapped_column(Integer, nullable=True)
    repository_proprietario: Mapped[str | None] = mapped_column(String, nullable=True)
    endpoint: Mapped[str | None] = mapped_column(String, nullable=True)
    endpoint_start_date_end_date: Mapped[str | None] = mapped_column(String, nullable=True)
    stato_monitoraggio: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # --- LDO ---
    LDO_LDO: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LDO_LDOdigitale: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LDO_LDOdigitale_TDTLDO: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LDO_LDOdigitale_applicativoLDO: Mapped[str | None] = mapped_column(String, nullable=True)
    LDO_LDOdigitale_fornitoreApplicativoLDO: Mapped[str | None] = mapped_column(String, nullable=True)
    LDO_LDOdigitale_versioneApplicativoLDO: Mapped[str | None] = mapped_column(String, nullable=True)
    LDO_LDOdigitale_PDFfirmatiLDO: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LDO_CN_Certificato: Mapped[str | None] = mapped_column(String, nullable=True)
    LDO_richiesta_adesione: Mapped[date | None] = mapped_column(Date, nullable=True)
    LDO_ticket_cart: Mapped[str | None] = mapped_column(String, nullable=True)
    LDO_referente_adesione: Mapped[str | None] = mapped_column(String, nullable=True)
    LDO_referente_tecnico_applicativo: Mapped[str | None] = mapped_column(String, nullable=True)
    LDO_test_validate_create: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LDO_test_sostituzione: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LDO_test_aggiornamento: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LDO_test_eliminazione: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LDO_data_richiesta_certificato: Mapped[date | None] = mapped_column(Date, nullable=True)
    LDO_data_emissione_certificato: Mapped[date | None] = mapped_column(Date, nullable=True)
    LDO_autorizzazione_prod: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LDO_data_invio_certificati_ente_adesione: Mapped[date | None] = mapped_column(Date, nullable=True)
    LDO_data_accreditamento: Mapped[date | None] = mapped_column(Date, nullable=True)
    LDO_data_autorizzazione_prod: Mapped[date | None] = mapped_column(Date, nullable=True)
    LDO_psw_certificato_raki: Mapped[str | None] = mapped_column(String, nullable=True)


    # --- LAB ---
    LAB_LAB: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_LABdigitale: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_LABdigitale_TDTLAB: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_LABdigitale_applicativoLAB: Mapped[str | None] = mapped_column(String, nullable=True)
    LAB_LABdigitale_fornitoreApplicativoLAB: Mapped[str | None] = mapped_column(String, nullable=True)
    LAB_LABdigitale_versioneApplicativoLAB: Mapped[str | None] = mapped_column(String, nullable=True)
    LAB_LABdigitale_PDFfirmatiLAB: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_CN_Certificato: Mapped[str | None] = mapped_column(String, nullable=True)
    LAB_richiesta_adesione: Mapped[date | None] = mapped_column(Date, nullable=True)
    LAB_ticket_cart: Mapped[str | None] = mapped_column(String, nullable=True)
    LAB_referente_adesione: Mapped[str | None] = mapped_column(String, nullable=True)
    LAB_referente_tecnico_applicativo: Mapped[str | None] = mapped_column(String, nullable=True)
    LAB_test_validate_create: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_test_sostituzione: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_test_aggiornamento: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_test_eliminazione: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_data_richiesta_certificato: Mapped[date | None] = mapped_column(Date, nullable=True)
    LAB_data_emissione_certificato: Mapped[date | None] = mapped_column(Date, nullable=True)
    LAB_autorizzazione_prod: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_data_invio_certificati_ente_adesione: Mapped[date | None] = mapped_column(Date, nullable=True)
    LAB_data_accreditamento: Mapped[date | None] = mapped_column(Date, nullable=True)
    LAB_data_autorizzazione_prod: Mapped[date | None] = mapped_column(Date, nullable=True)
    LAB_psw_certificato_raki: Mapped[str | None] = mapped_column(String, nullable=True)


    # --- RAD ---
    RAD_RAD: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_RADdigitale: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_RADdigitale_TDTRAD: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_RADdigitale_applicativoRAD: Mapped[str | None] = mapped_column(String, nullable=True)
    RAD_RADdigitale_fornitoreApplicativoRAD: Mapped[str | None] = mapped_column(String, nullable=True)
    RAD_RADdigitale_versioneApplicativoRAD: Mapped[str | None] = mapped_column(String, nullable=True)
    RAD_RADdigitale_PDFfirmatiRAD: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_CN_Certificato: Mapped[str | None] = mapped_column(String, nullable=True)
    RAD_richiesta_adesione: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAD_ticket_cart: Mapped[str | None] = mapped_column(String, nullable=True)
    RAD_referente_adesione: Mapped[str | None] = mapped_column(String, nullable=True)
    RAD_referente_tecnico_applicativo: Mapped[str | None] = mapped_column(String, nullable=True)
    RAD_test_validate_create: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_test_sostituzione: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_test_aggiornamento: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_test_eliminazione: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_data_richiesta_certificato: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAD_data_emissione_certificato: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAD_autorizzazione_prod: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_data_invio_certificati_ente_adesione: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAD_data_accreditamento: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAD_data_autorizzazione_prod: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAD_psw_certificato_raki: Mapped[str | None] = mapped_column(String, nullable=True)

    # --- RSA ---
    RSA_RSA: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_RSAdigitale: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_RSAdigitale_TDTRSA: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_RSAdigitale_applicativoRSA: Mapped[str | None] = mapped_column(String, nullable=True)
    RSA_RSAdigitale_fornitoreApplicativoRSA: Mapped[str | None] = mapped_column(String, nullable=True)
    RSA_RSAdigitale_versioneApplicativoRSA: Mapped[str | None] = mapped_column(String, nullable=True)
    RSA_RSAdigitale_PDFfirmatiRSA: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_CN_Certificato: Mapped[str | None] = mapped_column(String, nullable=True)
    RSA_richiesta_adesione: Mapped[date | None] = mapped_column(Date, nullable=True)
    RSA_ticket_cart: Mapped[str | None] = mapped_column(String, nullable=True)
    RSA_referente_adesione: Mapped[str | None] = mapped_column(String, nullable=True)
    RSA_referente_tecnico_applicativo: Mapped[str | None] = mapped_column(String, nullable=True)
    RSA_test_validate_create: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_test_sostituzione: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_test_aggiornamento: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_test_eliminazione: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_data_richiesta_certificato: Mapped[date | None] = mapped_column(Date, nullable=True)
    RSA_data_emissione_certificato: Mapped[date | None] = mapped_column(Date, nullable=True)
    RSA_autorizzazione_prod: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_data_invio_certificati_ente_adesione: Mapped[date | None] = mapped_column(Date, nullable=True)
    RSA_data_accreditamento: Mapped[date | None] = mapped_column(Date, nullable=True)
    RSA_data_autorizzazione_prod: Mapped[date | None] = mapped_column(Date, nullable=True)
    RSA_psw_certificato_raki: Mapped[str | None] = mapped_column(String, nullable=True)

    # --- RAP ---
    RAP_RAP: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_RAPdigitale: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_RAPdigitale_TDTRAP: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_RAPdigitale_applicativoRAP: Mapped[str | None] = mapped_column(String, nullable=True)
    RAP_RAPdigitale_fornitoreApplicativoRAP: Mapped[str | None] = mapped_column(String, nullable=True)
    RAP_RAPdigitale_versioneApplicativoRAP: Mapped[str | None] = mapped_column(String, nullable=True)
    RAP_RAPdigitale_PDFfirmatiRAP: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_CN_Certificato: Mapped[str | None] = mapped_column(String, nullable=True)
    RAP_richiesta_adesione: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAP_ticket_cart: Mapped[str | None] = mapped_column(String, nullable=True)
    RAP_referente_adesione: Mapped[str | None] = mapped_column(String, nullable=True)
    RAP_referente_tecnico_applicativo: Mapped[str | None] = mapped_column(String, nullable=True)
    RAP_test_validate_create: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_test_sostituzione: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_test_aggiornamento: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_test_eliminazione: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_data_richiesta_certificato: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAP_data_emissione_certificato: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAP_autorizzazione_prod: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_data_invio_certificati_ente_adesione: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAP_data_accreditamento: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAP_data_autorizzazione_prod: Mapped[date | None] = mapped_column(Date, nullable=True)
    RAP_psw_certificato_raki: Mapped[str | None] = mapped_column(String, nullable=True)

    # --- Check LDO/LAB/RAD/RSA/RPA ---
    LDO_fornitore_name_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LDO_software_name_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LDO_software_version_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_fornitore_name_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_software_name_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    LAB_software_version_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_fornitore_name_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_software_name_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAD_software_version_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_fornitore_name_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_software_name_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RSA_software_version_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_fornitore_name_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_software_name_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    RAP_software_version_check: Mapped[bool | None] = mapped_column(Boolean, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=text("now()"),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=text("now()"),
        nullable=False,
    )


class AccessLog(Base):
    __tablename__ = "access_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    auth_time: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
    )
    fiscal_number: Mapped[str | None] = mapped_column(String, nullable=True)
    preferred_username: Mapped[str | None] = mapped_column(String, nullable=True)
    auth_type: Mapped[str] = mapped_column(String, nullable=False)
    auth_level: Mapped[str] = mapped_column(String, nullable=False)
    sid: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=text("now()"),
        nullable=False,
    )
