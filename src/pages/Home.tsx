import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "../common/types";

export const Home = (): FunctionComponent => {
	const { t, i18n } = useTranslation();

	const onTranslateButtonClick = async (): Promise<void> => {
		if (i18n.resolvedLanguage === "en") {
			await i18n.changeLanguage("es");
		} else {
			await i18n.changeLanguage("en");
		}
	};

	return (
		<p className="text-red-500 font-bold">
  			Привіт! Це моя Лабораторна №7. HMR працює!
		</p>
	);
};
