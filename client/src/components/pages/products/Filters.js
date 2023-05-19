import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";

function Filters() {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;

  const [category, setCategory] = state.productsAPI.category;
  const [sort, setSort] = state.productsAPI.sort;
  const [search, setSearch] = state.productsAPI.search;

  const handleCategory = (e) => {
    setCategory(e.target.value);
    //setSearch("");
  };

  return (
    <div className="filter_menu">
      <div className="row">
        <span>Фильтр: </span>
        <select
          data-testid="category-select"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Все товары</option>
          {Array.isArray(categories) &&
            categories.map((category) => (
              <option value={"category=" + category.name} key={category._id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>

      <input
        type="text"
        value={search}
        placeholder="Введите что искать!"
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <div className="row sort">
        <span>Сортировать по: </span>
        <select
          data-testid="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          name="sort"
        >
          <option value="">Последние</option>
          <option value="sort=oldest">Не новые</option>
          <option value="sort=-sold">Лучшие продажи</option>
          <option value="sort=-price">Цена: По-убыванию</option>
          <option value="sort=price">Цена: По-возрастанию</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;
