import TabHead from "../../utils/TabHead";
import { useCallback, useEffect, useState } from "react";
import { BarLoader } from "../../utils/Loader";
import { RequestService } from "../../services";
import Search from "../../utils/Search";
import { Button } from "../../utils/Button";
import { searchItems } from "./utils/functions";
import NavigatorPager from "../../utils/NavigatorPager";
import TableList from "./utils/List";
import SideModal from "../../utils/SideModal";
import AddUpdate from "./utils/AddUpdate";

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
      const response = await RequestService.getParam("/orders", {
        page: currentPage,
        per_page: perPage,
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
  }, []);

  useEffect(() => {
    fetch();
  }, []);

  const filteredItems = items.length > 0 ? searchItems(items, search) : [];

  const itemsToDisplay = filteredItems;

  if (loading) {
    return (
      <main className="h-full grow flex flex-col justify-center items-center rounded-[20px] border border-[#E7E7E7] overflow-y-auto">
        <BarLoader />
      </main>
    );
  }

  return (
    <main className="h-full grow flex flex-col border border-[#E7E7E7] overflow-y-auto">
      <TabHead name="Orders"></TabHead>
      <div className="p-5 w-full flex flex-col gap-3">
        <div className="w-full flex gap-2 items-center text-sm">
          <Search
            value={search}
            setValue={setSearch}
            width="250px"
            placeholder="Search orders..."
          />
          <div className="flex items-center gap-2 ml-auto">
            <Button
              name="Add Order"
              onClick={() => {
                setShowCreate(true);
                setSelectedItem(null);
              }}
            />
          </div>
        </div>
        <div className="mt-5">
          <TableList
            itemsToDisplay={itemsToDisplay}
            loading={loading}
            fetch={fetch}
            setShowCreate={setShowCreate}
            setSelectedItem={setSelectedItem}
          />
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
