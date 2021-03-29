/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useRef, useEffect, memo } from "react";
import { useForm, useSimpleSearch, useFocusObserver } from "@core/hooks";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Observer } from "mobx-react-lite";

import { Table } from "@components/ordinary/Table";
import { Field } from "@components/ordinary/Field";
import { DiscountPrice } from "@components/ordinary/DiscountPrice";

import { Align } from "@components/simple/Align";
import { Avatar } from "@components/simple/Avatar";

import * as S from "./styled";

import { formSchemes } from "@core/schemes";
import { routesConfig } from "@core/config";

const SimpleSearch = memo(() => {
	const history = useHistory();
	const form = useForm(formSchemes.search);
	const simpleSearch = useSimpleSearch();

	const searchInputRef = useRef<HTMLInputElement>(null);

	const searchInputFocusObserver = useFocusObserver(searchInputRef);

	const handleFormSubmit = useCallback((event: React.FormEvent) => {
		event.preventDefault();

		if (simpleSearch.isFoundSomething()) {
			const searchString = simpleSearch.getSearchString();
			const searchPageURL = routesConfig.productBrowserRoutes.search(searchString);

			history.push(searchPageURL);
		}
	}, []);

	const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		simpleSearch.setSearchString(value);
	}, []);

	useEffect(() => {
		searchInputFocusObserver.setFocused(false);
	}, [history.location.pathname]);

	return (
		<S.SimpleSearch>
			<S.InputGroup>
				<form onSubmit={handleFormSubmit}>
					<Observer>
						{() => (
							<Field
								{...form.bindField("search", {
									ref: searchInputRef,
									onChange: handleInputChange,
								})}
							/>
						)}
					</Observer>
				</form>
			</S.InputGroup>
			<Observer>
				{() => (
					<S.Results
						$isVisible={
							searchInputFocusObserver.isFocused() && simpleSearch.isFoundSomething()
						}>
						<Observer>
							{() => (
								<Table
									columns={{}}
									rows={simpleSearch.getFoundData()}
									renderRows={({ row, Row, Cell, CellContent }) => (
										<Link
											key={`row-${row.id}`}
											to={routesConfig.productBrowserRoutes.getOne(row.code)}>
											<Row $templateColumns={[null, 1, 1]}>
												{[
													<Avatar image={{ src: row.image }} scale='medium' isRounded={false} />,
													row.name,
													<S.DiscountPriceGroup>
														<DiscountPrice {...row.price} />
													</S.DiscountPriceGroup>,
												].map((cell, index) => (
													<Cell key={`cell-${index}`}>
														<Align axis={["x", "y"]}>
															<CellContent>{cell}</CellContent>
														</Align>
													</Cell>
												))}
											</Row>
										</Link>
									)}
								/>
							)}
						</Observer>
					</S.Results>
				)}
			</Observer>
		</S.SimpleSearch>
	);
});

export { SimpleSearch };
