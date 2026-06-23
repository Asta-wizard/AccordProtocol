import { useState } from "react";
import type { Proposal, ProposalStatus } from "../types/accord";
import { ProposalCard } from "../components/ProposalCard";

type Filter = "all" | ProposalStatus;

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "ready", label: "Ready" },
  { key: "executed", label: "Executed" },
  { key: "expired", label: "Expired" },
  { key: "revoked", label: "Revoked" },
];

export function HistoryPage({
  proposals,
  onApprove,
}: {
  proposals: Proposal[];
  onApprove: (id: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<Filter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const noop = () => {};

  const filteredProposals = proposals
    .filter((p) => activeTab === "all" || p.status === activeTab)
    .filter((p) =>
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Proposal History</h2>
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`text-xs px-3 py-1 rounded-md capitalize transition-colors ${
                activeTab === tab.key
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by description…"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
        />
        <div className="absolute left-3 top-2.5 text-zinc-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        {filteredProposals.length === 0 ? (
          <p className="text-zinc-600 text-sm py-8 text-center">
            {searchTerm
              ? "No proposals match your search"
              : `No ${activeTab === "all" ? "" : `${activeTab} `}proposals found`}
          </p>
        ) : (
          filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              walletAddress={null}
              onApprove={onApprove}
              onExecute={noop}
              onRevoke={noop}
            />
          ))
        )}
      </div>
    </>
  );
}
