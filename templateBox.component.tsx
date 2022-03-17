import React, { useState, MouseEvent, useRef, useEffect } from 'react';
import { BsFolder } from 'react-icons/bs';
import ModalCustom from 'components/ModalCustom/ModalCustom.component';
import styles from './templateBox.module.scss';
import { IconCancel, IconCheck, IconPencil } from 'assets/icons/icons';
import { FiCheck, FiDownload, FiLogIn } from 'react-icons/fi';
import { BiUpload } from 'react-icons/bi';
import Checkbox from 'react-custom-checkbox';
import InputCustom from '../InputCustom/InputCustom.component';
import { downloadDocumentTemplate, sendEmailTemplate, updateDocumentTemplateName } from '../../pages/Documents/actions';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../partials/Loader/Loader.component';
import { TemplateName } from '../../types/templateName.type';
import { DownloadDocument } from '../../types/downloadDocument.type';
import { EmailBody } from '../../types/emailBody.type';
import { useTranslation } from 'react-i18next';

interface Props {
	name?: string;
	onSubmit?: (event: MouseEvent<HTMLButtonElement>) => void;
	id?: number;
	file?: any;
	isChecked?: boolean;
	setCheckedDocuments?: any;
	isForDelete?: boolean;
}

const TemplateBox: React.FC<Props> = props => {
    const { t, i18n } = useTranslation('common');
	const tenantId = 1;

	const [name, setName] = useState<string>('');
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
	const [emailValidMessage, setEmailValidMessage] = useState<string>("");
	const [isOnEdit, setIsOnEdit] = useState<boolean>(false);
	const [isEmailOpen, setIsEmailOpen] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('');
	const [file, setFile] = useState(null);
	const isUpdateDocumentTemplateLoading = useSelector((state: RootStateOrAny) => state.documentsReducer.updateDocumentTemplateLoading);
	const isSendEmailLoading = useSelector((state: RootStateOrAny) => state.documentsReducer.sendEmailLoading);
	const nameRef = useRef(null);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!isSendEmailLoading) {
			setIsModalOpen(false);
		}
	}, [isSendEmailLoading]);

	useEffect(() => {
		if (props.name) {
			setName(props.name);
		} else {
			setName('');
		}
	}, [props.name]);

	const handleOpenModal = () => {
		if (!isOnEdit) {
			setIsModalOpen(!isModalOpen);
		}
	};

	const truncate = (str) => {
		return str.length > 10 ? str.substring(0, 20) + '...' : str;
	};

	const handleTemplateName = (e) => {
		setName(e.target.value);
	};

	const handleCheckTemplate = (checked, id) => {
		props.setCheckedDocuments(prev => {
			if (checked) {
				return [
					...prev, id,
				];
			} else {
				return prev.filter(item => item !== id);
			}
		});
	};

	const handleEditName = () => {
		const templateName: TemplateName = {
			id: props.id,
			name: name,
		};
		if (name !== '') {
			dispatch(updateDocumentTemplateName(templateName));
			setIsOnEdit(false);
		} else {
			toast.error(t('toast.nameIsReq'));
		}
	};

	const handleEmailChange = (e) => {
		const emailRegex = /\S+@\S+\.\S+/;
		setEmail(e.target.value);
		if (emailRegex.test(email)) {
			setIsEmailValid(true);
		} else {
			setIsEmailValid(false);
			setEmailValidMessage('Please enter a valid email!');
		}
	};

	const handleDownload = (isDownload: boolean) => {
		const downloadTemplateData: DownloadDocument = {
			id: props.id,
			tenantId
		};

		if (isEmailOpen) {
			setIsEmailOpen(false);
		} else {
			if (isDownload) {
				dispatch(downloadDocumentTemplate(downloadTemplateData));
			}
		}
	};

	const handleSaveDocument = () => {
		const data: any = new FormData();
		data.append('id', props.id);
		data.append('file', file);

		const emailData: EmailBody = {
			email,
			documentId: props.id,
		};

		if (isEmailOpen) {
			if (email !== "" && isEmailValid) {
				dispatch(sendEmailTemplate(emailData));
			}
			else {
				toast.error(t('toast.emailIsReq'));
			}
		} else {
			if (file !== null) {
				dispatch(updateDocumentTemplateName(data));
				setFile(null);
				setIsModalOpen(false);
			}
		}
	};

	return (
		<div className={styles.template}>
			<div className={styles.templateBox}>
				<div className={styles.checkboxTemplate}>
					{props.isForDelete ? <div className={styles.isCheckBoxActive}>
						<Checkbox
							className={styles.checkbox}
							icon={
								<div className={styles.checkboxIconContainer}>
									<FiCheck color="#261F63" size={20} />
								</div>
							}
							checked={props.isChecked || false}
							onChange={(checked) => handleCheckTemplate(checked, props.id)}
						/>
					</div> : null}
				</div>
				<div
					className={styles.firstBox}
					onClick={handleOpenModal}
					onKeyDown={(e) => {
						const inputCondition = e.key === 'Enter';
						inputCondition && handleEditName();
					}}>
					<span><BsFolder className={styles.folderIcon} color="#89c732" width={30} height={28} /></span>
					<InputCustom
						onChangeHandler={handleTemplateName}
						className={styles.rowInput}
						name="occupation"
						value={isOnEdit ? name : truncate(name)}
						// title={name}
						attributes={{
							autoFocus: true,
							title: name,
						}}
						readOnly={!isOnEdit}
						type="text"
						ref={nameRef}
					/>
				</div>
				<div className={styles.secondBox}>
					{!isOnEdit ?
						<span
							onClick={() => {
								nameRef.current.focus();
								setIsOnEdit(!isOnEdit);
							}}
						>
							<IconPencil
								fill={'#89c732'}
								width="21px"
								height="20px"
							/>
						</span>
						: <span className={styles.editIcons}>
							{isUpdateDocumentTemplateLoading ? <Loader style={{ width: '22px', height: '22px' }} /> :
								<>
									<span onClick={handleEditName}>
										<IconCheck />
									</span>
									<span onClick={() => setIsOnEdit(false)}>
										<IconCancel
											fill={'#89c732'}
											width="31px"
											height="30px"
										/>
									</span>
								</>}
						</span>}
				</div>
			</div>

			<ModalCustom
				show={isModalOpen}
				contentClass={styles.contentClass}
				hideFooterButton={false}
				submitLoading={isEmailOpen && isSendEmailLoading || !isEmailOpen && isUpdateDocumentTemplateLoading}
				submitText={isEmailOpen ? 'Dërgo' : `${t('reports.save')}`}
				footerClass={styles.footerClass}
				onClose={handleOpenModal}
				onSubmit={handleSaveDocument}
			>
				<div className={styles.actions}>
					<div className={!isEmailOpen ? styles.iconsBox : styles.iconsBoxDeactivated}
						onClick={() => handleDownload(true)}>
						<FiDownload strokeWidth="2px" className={styles.icons} />
						<span>Shkarko</span>
					</div>
					<div className={styles.iconsBox} onClick={() => setIsEmailOpen(!isEmailOpen)}>
						<FiLogIn className={styles.icons} />
						<span>Dërgo me email</span>
					</div>
					<div
						className={`${styles.fileInputContainer} ${!isEmailOpen ? styles.iconsBox : styles.iconsBoxDeactivated}`}
						onClick={() => handleDownload(false)}
					>
						<BiUpload className={styles.uploadIcon} />
						<input type="file" onChange={(e) => setFile(e.target.files[0])} />
						<span>Ngarko</span>
					</div>
				</div>
				{isEmailOpen ? <div className={styles.emailBox} onKeyDown={(e) => {
					const inputCondition = e.key === 'Enter';
					inputCondition && handleSaveDocument();
				}}>
					<InputCustom
						onChangeHandler={handleEmailChange}
						className={styles.rowInputEmail}
						name="occupation"
						value={email}
						placeholder={'Enter e-mail'}
						attributes={{ autoFocus: true, }}
						type="text"
					/>
					{!isEmailValid && email !== "" ? <span className={styles.validateEmail}>{emailValidMessage}</span> : null}
				</div> : null}
				<p className={styles.selectedFileName}>{file?.name && file?.name}</p>
			</ModalCustom>
		</div>
	);
};

export default TemplateBox;