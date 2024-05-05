'use client';
import React, { Fragment, useEffect, useState } from "react";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Transition, Dialog, Menu } from "@headlessui/react";
import { getData, addData, editQuests, deleteData } from "@/utils/utils";
import Loader from "@/components/loader";
import { ChevronDownIcon, EllipsisHorizontalIcon } from '@heroicons/react/20/solid';

export default function Page() {
  const [user] = useAuthState(auth);
  const [questData, setQuestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questToBeDeleted, setQuestToBeDeleted] = useState(null);
  const [questUpdated, setQuestUpdated] = useState(false);
  const [questForm, setQuestForm] = useState({
    mode: "add",
    data: {
      name: "",
      link: "",
      twitter: "",
      discord: "",
      user: "",
      light: "",
    },
  });

  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const fetchQuests = async () => {
      if (!user) {
        router.replace("/");
        return;
      }
      try {
        setLoading(true);
        const questsDataRes = await getData("quests");
        questsDataRes && setQuestData(questsDataRes);
        setLoading(false);
        setQuestUpdated(false);
      } catch (error) {
        console.error("Error fetching Quest Data:", error);
        setLoading(false);
      }
    };
    fetchQuests();
  }, [router, user, questUpdated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestForm((prevForm) => ({
      ...prevForm,
      data: {
        ...prevForm.data,
        [name]: value,
      },
    }));
  };

  const openModal = (quest, mode) => {
    setQuestForm({
      mode: mode,
      data: mode === "add" ? {
      name: "",
      link: "",
      twitter: "",
      discord: "",
      user: "",
      light: "",
    } : quest,
    });
    setIsModalOpen(true);
  };

  const saveQuest = async (questForm) => {
    let dataToSave = { ...questForm.data };
    delete dataToSave.id;
    delete dataToSave.created;
    const response =
      questForm.mode === "add"
        ? await addData("quests", questForm.data)
        : await editQuests(questForm.data.id, dataToSave);

    if (response.success) setQuestUpdated(true);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (questToBeDeleted?.id) await deleteData("quests", questToBeDeleted.id);
    setQuestUpdated(true);
    setIsDeleteModalOpen(false);
  };

  const openDeleteModal = (quest) => {
    setQuestToBeDeleted(quest);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      {loading && <Loader show={loading} />}
      {process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').includes(user?.email) && (
        <div className="">
          <div className="pr-4 pb-24">
            <div className="flex items-center justify-center w-full pt-0 text-center">
              <div className="w-2/5 relative pt-0 z-10">
                <div className="absolute block w-full border-2 border-b rounded-xl border-fuchsia-700 shrink-0 bg-fuchsia-700 bca-glow-top"></div>
              </div>
            </div>
            <div className="w-full text-[0.8125rem] leading-5 text-slate-900 rounded-xl mt-6 bg-[#250C3D] border-purple-950 border pb-12">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <button
                  type="button"
                  className="text-white bg-primary-700 focus:ring-2 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2"
                  onClick={() => openModal(questForm.data, "add")}
                >
                  Add Quest
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  {/* Table header */}
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      {["Quest Name", "link", "Twitter", "Discord", "User", "Light", "Actions"].map((header, index) => (
                        <th key={index} scope="col" className="px-4 py-4">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody>
                    {questData &&
                      questData.map((quest, index) => (
                        <tr key={quest.name} className="border-b dark:border-gray-700">
                          {/* Quest details */}
                          {["name", "link", "twitter", "discord", "user", "light"].map((key, index) => (
                            <td key={index} className="text-white px-4 py-3 max-w-[12rem] truncate">{quest[key]}</td>
                          ))}
                          {/* Actions */}
                          <td className="text-white px-4 py-3 flex items-center justify-end">
                            <Menu as="div" className="relative inline-block text-left">
                              <Menu.Button className="inline-flex w-full justify-center rounded-md pr-2 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                                <EllipsisHorizontalIcon className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100" aria-hidden="true" />
                              </Menu.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className={`${index === questData.length - 1 || index === questData.length - 2 ? 'bottom-full' : 'top-full'} absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white bg-opacity-0 shadow-lg ring-1 ring-black/5 z-10`}>
                                  {/* Edit option */}
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={`${active ? 'bg-violet-500 text-white' : 'text-black'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        onClick={() => openModal(quest, 'edit')}
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </Menu.Item>
                                  {/* Delete option */}
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={`${active ? 'bg-violet-500 text-white' : 'text-black'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        onClick={() => openDeleteModal(quest)}
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Quest Dialog */}
      <EditQuestDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        questForm={questForm}
        onSave={saveQuest}
        onInputChange={handleInputChange}
      />
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        questName={questToBeDeleted?.name}
      />
    </>
  );
}

// Edit Quest Dialog Component
function EditQuestDialog({ isOpen, onClose, questForm, onSave, onInputChange }) {
  const keyOrder = ["name", "link", "twitter", "discord", "user", "light"];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
        <Dialog.Panel  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <Dialog.Title>{questForm.mode === "add" ? "Add Quest" : "Edit Quest"}</Dialog.Title>
          <form>
            <div className="grid gap-4 mb-4 sm:grid-cols-2">
              {keyOrder.map((key) => (
                <div key={key} className="mb-4">
                  <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={key}
                    id={key}
                    value={questForm.data[key]}
                    onChange={onInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => onSave(questForm)}
              >
                {questForm.mode === "add" ? "Add" : "Save"}
              </button>
              <button
                type="button"
                className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 ml-4"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </Dialog.Panel>
            </Transition.Child>
            </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// Delete Confirmation Dialog Component
function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, questName }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title>Confirm Delete</Dialog.Title>
                <Dialog.Description>Are you sure you want to delete Quest: {questName}?</Dialog.Description>
                <div className="mt-4 flex justify-end">
                    <button
                    className="bg-red-500 text-white rounded-md px-4 py-2 mr-2"
                    onClick={onConfirm}
                    >
                    Confirm
                    </button>
                    <button
                    className="bg-gray-500 text-white rounded-md px-4 py-2"
                    onClick={onClose}
                    >
                    Cancel
                    </button>
                </div>
                </Dialog.Panel>
            </Transition.Child>
            </div>
        </div>
      </Dialog>
    </Transition>
  );
}
