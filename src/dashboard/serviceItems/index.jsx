import { useCallback, useEffect, useState } from "react";
import { BarLoader } from "../../utils/Loader";
import { RequestService } from "../../services";
import Search from "../../utils/Search";
import { Button } from "../../utils/Button";
import NavigatorPager from "../../utils/NavigatorPager";
import TableList from "./utils/List";
import SideModal from "../../utils/SideModal";
import AddUpdate from "./utils/AddUpdate";
import { useIsMobile } from "../../utils/use-mobile";

export default function Index() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: 20,
  });

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await RequestService.getParam("/service-items", {
        page: currentPage,
        per_page: perPage,
        search: search,
      });
      console.log(response);
      setItems(response.data.data.data);
      setPagination({
        total: response.data.data.total,
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [search, currentPage, perPage]);

  useEffect(() => {
    fetch();
  }, [search, currentPage, perPage]);

  const filteredItems = items.length > 0 ? items : [];

  const itemsToDisplay = filteredItems;
  const isMobile = useIsMobile();

  return (
    <main className="h-full grow flex flex-col border border-[#E7E7E7] overflow-y-auto">
      <div className="p-5 w-full flex flex-col gap-4">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Service Items</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {pagination.total > 0
                ? `${pagination.total} item${pagination.total !== 1 ? "s" : ""}`
                : "Manage your service catalogue"}
            </p>
          </div>
          <Button
            name="Add Service Item"
            onClick={() => {
              setShowCreate(true);
              setSelectedItem(null);
            }}
          />
        </div>
        {/* Search */}
        <Search
          value={search}
          setValue={setSearch}
          placeholder="Search service items..."
          width={isMobile ? "w-full" : "w-64"}
        />
        <div>
          {loading ? (
            <main className="p-10 flex flex-col justify-center items-center">
              <BarLoader />
            </main>
          ) : (
            <TableList
              itemsToDisplay={itemsToDisplay}
              loading={loading}
              fetch={fetch}
              setShowCreate={setShowCreate}
              setSelectedItem={setSelectedItem}
            />
          )}
        </div>
      </div>
      <div className="p-5 mt-auto">
        {itemsToDisplay.length > 0 && (
          <NavigatorPager
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            perPage={perPage}
            setPerPage={setPerPage}
            pagination={pagination}
          />
        )}
      </div>
      {showCreate && (
        <SideModal
          child={
            <AddUpdate
              setShowCreate={setShowCreate}
              item={selectedItem}
              fetch={fetch}
            />
          }
        />
      )}
    </main>
  );
}
