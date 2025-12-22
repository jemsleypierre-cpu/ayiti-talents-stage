import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VoteRecord {
  candidateId: string;
  timestamp: number;
  ip?: string;
}

const VOTE_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_VOTES_PER_DAY = 1;
const STORAGE_KEY = 'rjt_vote_records';

export const useVoteProtection = () => {
  const { toast } = useToast();
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVoteRecords();
  }, []);

  const loadVoteRecords = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const records: VoteRecord[] = JSON.parse(stored);
        // Clean up old records
        const validRecords = records.filter(
          r => Date.now() - r.timestamp < VOTE_COOLDOWN_MS
        );
        setVoteRecords(validRecords);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validRecords));
      }
    } catch (error) {
      console.error('Error loading vote records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveVoteRecords = (records: VoteRecord[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      setVoteRecords(records);
    } catch (error) {
      console.error('Error saving vote records:', error);
    }
  };

  const canVote = (candidateId: string): boolean => {
    const now = Date.now();
    
    // Check if already voted for this candidate today
    const existingVote = voteRecords.find(
      r => r.candidateId === candidateId && now - r.timestamp < VOTE_COOLDOWN_MS
    );
    
    if (existingVote) {
      return false;
    }

    // Check total votes today
    const votesToday = voteRecords.filter(
      r => now - r.timestamp < VOTE_COOLDOWN_MS
    ).length;

    return votesToday < MAX_VOTES_PER_DAY;
  };

  const getTimeUntilNextVote = (candidateId?: string): number => {
    const now = Date.now();
    
    let lastVoteTime = 0;
    
    if (candidateId) {
      const lastVote = voteRecords.find(r => r.candidateId === candidateId);
      if (lastVote) {
        lastVoteTime = lastVote.timestamp;
      }
    } else {
      const lastVote = voteRecords.reduce((latest, r) => 
        r.timestamp > latest ? r.timestamp : latest, 0
      );
      lastVoteTime = lastVote;
    }

    if (lastVoteTime === 0) return 0;

    const nextVoteTime = lastVoteTime + VOTE_COOLDOWN_MS;
    return Math.max(0, nextVoteTime - now);
  };

  const formatTimeRemaining = (ms: number): string => {
    if (ms <= 0) return '';

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const recordVote = (candidateId: string): boolean => {
    if (!canVote(candidateId)) {
      const timeRemaining = getTimeUntilNextVote(candidateId);
      toast({
        title: "Vote déjà effectué",
        description: `Vous pourrez voter à nouveau dans ${formatTimeRemaining(timeRemaining)}`,
        variant: "destructive"
      });
      return false;
    }

    const newRecord: VoteRecord = {
      candidateId,
      timestamp: Date.now(),
    };

    const updatedRecords = [...voteRecords, newRecord];
    saveVoteRecords(updatedRecords);

    return true;
  };

  const hasVotedFor = (candidateId: string): boolean => {
    const now = Date.now();
    return voteRecords.some(
      r => r.candidateId === candidateId && now - r.timestamp < VOTE_COOLDOWN_MS
    );
  };

  const getVotedCandidateIds = (): string[] => {
    const now = Date.now();
    return voteRecords
      .filter(r => now - r.timestamp < VOTE_COOLDOWN_MS)
      .map(r => r.candidateId);
  };

  return {
    canVote,
    recordVote,
    hasVotedFor,
    getTimeUntilNextVote,
    formatTimeRemaining,
    getVotedCandidateIds,
    isLoading,
  };
};

